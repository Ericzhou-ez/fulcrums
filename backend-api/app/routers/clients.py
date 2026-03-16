from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.client import Client, ClientCreate, ClientUpdate
from app.routers.websocket import broadcast_to_user

router = APIRouter(prefix="/clients", tags=["clients"])


def validate_client_data(data: ClientCreate, errors: List[str]):
    """Validate client creation data."""
    required = {
        "companyName": data.companyName,
        "address": data.address,
        "contactName": data.contactName,
        "contactPhoneNumber": data.contactPhoneNumber,
    }
    
    for k, v in required.items():
        if not v or not isinstance(v, str) or v.strip() == "":
            errors.append(f"{v} is not a valid value for {k}")
    
    client_data = {
        **required,
        "vatNumber": data.vatNumber or "",
        "eoriNumber": data.eoriNumber or "",
        "contactEmail": data.contactEmail or "",
    }
    
    for k, v in client_data.items():
        if isinstance(v, str) and len(v.strip()) >= 250:
            errors.append(f"{v} for {k} is longer than 250 characters")


@router.get("", response_model=List[Client])
async def get_clients(
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get all clients for the current user."""
    clients = list(db.clients.find({"userId": uid}))
    return [Client(**c) for c in clients]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: ClientCreate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Create a new client."""
    errors = []
    validate_client_data(client_data, errors)
    
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors)
        )
    
    client_id = str(ObjectId())
    now = datetime.utcnow()
    
    client_doc = {
        "clientId": client_id,
        "userId": uid,
        "companyName": client_data.companyName,
        "vatNumber": client_data.vatNumber,
        "eoriNumber": client_data.eoriNumber,
        "address": client_data.address,
        "contactName": client_data.contactName,
        "contactPhoneNumber": client_data.contactPhoneNumber,
        "contactEmail": client_data.contactEmail,
        "productIds": [],
        "updatedAt": now,
    }
    
    db.clients.insert_one(client_doc)
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "clients", "action": "created", "clientId": client_id})
    
    return {"success": True, "clientId": client_id}


@router.get("/{client_id}", response_model=Client)
async def get_client(
    client_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get a specific client."""
    client = db.clients.find_one({
        "userId": uid,
        "clientId": client_id
    })
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"客户 {client_id} 不存在"
        )
    
    return Client(**client)


@router.patch("/{client_id}", response_model=Client)
async def update_client(
    client_id: str,
    client_data: ClientUpdate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update a client."""
    client = db.clients.find_one({
        "userId": uid,
        "clientId": client_id
    })
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"客户 {client_id} 不存在"
        )
    
    update_data = {k: v for k, v in client_data.model_dump(exclude_unset=True).items() if v is not None}
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        db.clients.update_one(
            {"userId": uid, "clientId": client_id},
            {"$set": update_data}
        )
    
    updated_client = db.clients.find_one({
        "userId": uid,
        "clientId": client_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "clients", "action": "updated", "clientId": client_id})
    
    return Client(**updated_client)


@router.patch("/{client_id}/products")
async def update_client_products(
    client_id: str,
    product_ids: List[str],
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update product IDs for a client."""
    client = db.clients.find_one({
        "userId": uid,
        "clientId": client_id
    })
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"客户 {client_id} 不存在"
        )
    
    # Validate products exist
    if product_ids:
        product_count = db.products.count_documents({
            "userId": uid,
            "productId": {"$in": product_ids}
        })
        if product_count != len(product_ids):
            invalid_products = set(product_ids) - set(
                p["productId"] for p in db.products.find(
                    {"userId": uid, "productId": {"$in": product_ids}},
                    {"productId": 1}
                )
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"以下产品不存在: {', '.join(invalid_products)}"
            )
    
    db.clients.update_one(
        {"userId": uid, "clientId": client_id},
        {"$set": {"productIds": product_ids, "updatedAt": datetime.utcnow()}}
    )
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "clients", "action": "updated", "clientId": client_id})
    
    return {"success": True}


@router.delete("/{client_id}")
async def delete_client(
    client_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Delete a client."""
    client = db.clients.find_one({
        "userId": uid,
        "clientId": client_id
    })
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"客户 {client_id} 不存在"
        )
    
    db.clients.delete_one({
        "userId": uid,
        "clientId": client_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "clients", "action": "deleted", "clientId": client_id})
    
    return {"success": True}
