from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.order import Order, OrderCreate, OrderUpdate, OrderStatus, TransportMode
from app.routers.websocket import broadcast_to_user

router = APIRouter(prefix="/orders", tags=["orders"])

VALID_STATUSES: List[OrderStatus] = ["draft", "shipped", "customs_clearance", "delivered", "cancelled"]
VALID_TRANSPORT_MODES: List[TransportMode] = ["sea", "air", "road", "rail"]


def validate_order_products(products: List[dict]) -> List[dict]:
    """Validate and normalize order products."""
    validated = []
    for item in products:
        if not isinstance(item, dict):
            continue
        product_id = item.get("productId", "").strip()
        quantity = item.get("quantity", 0)
        
        if isinstance(quantity, str):
            try:
                quantity = max(0, int(quantity))
            except:
                quantity = 0
        elif isinstance(quantity, (int, float)):
            quantity = max(0, int(quantity))
        else:
            quantity = 0
        
        if product_id and quantity > 0:
            validated.append({"productId": product_id, "quantity": quantity})
    
    if len(validated) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="至少需要一项数量大于 0 的产品"
        )
    
    return validated


@router.get("", response_model=List[Order])
async def get_orders(
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get all orders for the current user."""
    orders = list(db.orders.find({"userId": uid}))
    return [Order(**o) for o in orders]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_order(
    order_data: OrderCreate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Create a new order."""
    if not order_data.orderName or not order_data.orderName.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="orderName is required and must be a non-empty string"
        )
    
    if not order_data.clientId or not order_data.clientId.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="clientId is required and must be a non-empty string"
        )
    
    # Validate client exists
    client = db.clients.find_one({
        "userId": uid,
        "clientId": order_data.clientId
    })
    if not client:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"客户 {order_data.clientId} 不存在"
        )
    
    # Validate products
    validated_products = validate_order_products([p.model_dump() for p in order_data.products])
    product_ids = list(set(p["productId"] for p in validated_products))
    
    product_count = db.products.count_documents({
        "userId": uid,
        "productId": {"$in": product_ids}
    })
    if product_count != len(product_ids):
        missing = set(product_ids) - set(
            p["productId"] for p in db.products.find(
                {"userId": uid, "productId": {"$in": product_ids}},
                {"productId": 1}
            )
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"以下产品不存在: {', '.join(missing)}"
        )
    
    order_id = str(ObjectId())
    now = datetime.utcnow()
    
    order_doc = {
        "orderId": order_id,
        "userId": uid,
        "orderName": order_data.orderName,
        "clientId": order_data.clientId,
        "products": validated_products,
        "incoterms": order_data.incoterms,
        "portOfLoading": order_data.portOfLoading,
        "portOfDischarge": order_data.portOfDischarge,
        "transportMode": order_data.transportMode,
        "estimatedShipmentDate": order_data.estimatedShipmentDate,
        "createdAt": now,
        "updatedAt": now,
        "status": "draft",
    }
    
    db.orders.insert_one(order_doc)
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "orders", "action": "created", "orderId": order_id})
    
    return {"success": True, "orderId": order_id}


@router.get("/{order_id}", response_model=Order)
async def get_order(
    order_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get a specific order."""
    order = db.orders.find_one({
        "userId": uid,
        "orderId": order_id
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"订单 {order_id} 不存在"
        )
    
    return Order(**order)


@router.patch("/{order_id}", response_model=Order)
async def update_order(
    order_id: str,
    order_data: OrderUpdate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update an order."""
    order = db.orders.find_one({
        "userId": uid,
        "orderId": order_id
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"订单 {order_id} 不存在"
        )
    
    update_data = {}
    
    # Validate and update fields
    if order_data.orderName is not None:
        if not order_data.orderName.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="orderName cannot be empty"
            )
        update_data["orderName"] = order_data.orderName
    
    if order_data.clientId is not None:
        client = db.clients.find_one({
            "userId": uid,
            "clientId": order_data.clientId
        })
        if not client:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"客户 {order_data.clientId} 不存在"
            )
        update_data["clientId"] = order_data.clientId
    
    if order_data.products is not None:
        validated_products = validate_order_products([p.model_dump() for p in order_data.products])
        product_ids = list(set(p["productId"] for p in validated_products))
        
        product_count = db.products.count_documents({
            "userId": uid,
            "productId": {"$in": product_ids}
        })
        if product_count != len(product_ids):
            missing = set(product_ids) - set(
                p["productId"] for p in db.products.find(
                    {"userId": uid, "productId": {"$in": product_ids}},
                    {"productId": 1}
                )
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"以下产品不存在: {', '.join(missing)}"
            )
        update_data["products"] = validated_products
    
    if order_data.incoterms is not None:
        update_data["incoterms"] = order_data.incoterms
    if order_data.portOfLoading is not None:
        update_data["portOfLoading"] = order_data.portOfLoading
    if order_data.portOfDischarge is not None:
        update_data["portOfDischarge"] = order_data.portOfDischarge
    if order_data.transportMode is not None:
        update_data["transportMode"] = order_data.transportMode
    if order_data.estimatedShipmentDate is not None:
        update_data["estimatedShipmentDate"] = order_data.estimatedShipmentDate
    if order_data.status is not None:
        if order_data.status not in VALID_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"status must be one of: {', '.join(VALID_STATUSES)}"
            )
        update_data["status"] = order_data.status
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        db.orders.update_one(
            {"userId": uid, "orderId": order_id},
            {"$set": update_data}
        )
    
    updated_order = db.orders.find_one({
        "userId": uid,
        "orderId": order_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "orders", "action": "updated", "orderId": order_id})
    
    return Order(**updated_order)


@router.patch("/{order_id}/state")
async def update_order_state(
    order_id: str,
    status: OrderStatus,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update order status."""
    if status not in VALID_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"status must be one of: {', '.join(VALID_STATUSES)}"
        )
    
    order = db.orders.find_one({
        "userId": uid,
        "orderId": order_id
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"订单 {order_id} 不存在"
        )
    
    db.orders.update_one(
        {"userId": uid, "orderId": order_id},
        {"$set": {"status": status, "updatedAt": datetime.utcnow()}}
    )
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "orders", "action": "updated", "orderId": order_id})
    
    return {"success": True, "orderId": order_id, "status": status}


@router.delete("/{order_id}")
async def delete_order(
    order_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Delete an order."""
    order = db.orders.find_one({
        "userId": uid,
        "orderId": order_id
    })
    
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"订单 {order_id} 不存在"
        )
    
    db.orders.delete_one({
        "userId": uid,
        "orderId": order_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "orders", "action": "deleted", "orderId": order_id})
    
    return {"success": True}
