from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.supplier import Supplier
from app.models.client import Client
from app.models.product import Product
from app.utils.firebase_storage import upload_base64_image
from app.routers.websocket import broadcast_to_user
from app.constants import MAX_SUPPLIERS_SYNC, MAX_CLIENTS_SYNC, MAX_PRODUCTS_SYNC
from pydantic import BaseModel

router = APIRouter(prefix="/sync", tags=["sync"])


class SyncPayload(BaseModel):
    suppliers: List[dict]
    clients: List[dict]
    products: List[dict]


@router.post("")
async def sync_all(
    payload: SyncPayload,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Bulk sync suppliers, clients, and products."""
    suppliers = payload.suppliers
    clients = payload.clients
    products = payload.products
    
    # Validate limits
    if len(suppliers) > MAX_SUPPLIERS_SYNC or len(clients) > MAX_CLIENTS_SYNC or len(products) > MAX_PRODUCTS_SYNC:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"超过批量上限：最多 {MAX_SUPPLIERS_SYNC} 供应商 / {MAX_CLIENTS_SYNC} 客户 / {MAX_PRODUCTS_SYNC} 产品"
        )
    
    now = datetime.utcnow()
    
    # Bulk write suppliers
    if suppliers:
        supplier_ops = []
        for s in suppliers:
            supplier_id = s.get("supplierId") or str(ObjectId())
            supplier_doc = {
                "supplierId": supplier_id,
                "userId": uid,
                "supplierName": s.get("supplierName", ""),
                "supplierPhone": s.get("supplierPhone"),
                "supplierAddress": s.get("supplierAddress"),
                "supplierEmail": s.get("supplierEmail"),
                "productIds": s.get("productIds", []),
                "updatedAt": s.get("updatedAt", now),
            }
            supplier_ops.append({
                "updateOne": {
                    "filter": {"userId": uid, "supplierId": supplier_id},
                    "update": {"$set": supplier_doc},
                    "upsert": True
                }
            })
        
        if supplier_ops:
            db.suppliers.bulk_write(supplier_ops)
    
    # Bulk write clients
    if clients:
        client_ops = []
        for c in clients:
            client_id = c.get("clientId") or str(ObjectId())
            client_doc = {
                "clientId": client_id,
                "userId": uid,
                "companyName": c.get("companyName", ""),
                "vatNumber": c.get("vatNumber"),
                "eoriNumber": c.get("eoriNumber"),
                "address": c.get("address", ""),
                "contactName": c.get("contactName", ""),
                "contactPhoneNumber": c.get("contactPhoneNumber", ""),
                "contactEmail": c.get("contactEmail"),
                "productIds": c.get("productIds", []),
                "updatedAt": c.get("updatedAt", now),
            }
            client_ops.append({
                "updateOne": {
                    "filter": {"userId": uid, "clientId": client_id},
                    "update": {"$set": client_doc},
                    "upsert": True
                }
            })
        
        if client_ops:
            db.clients.bulk_write(client_ops)
    
    # Process products (with image uploads)
    for p in products:
        product_id = p.get("productId") or str(ObjectId())
        
        # Handle image upload
        image_url = p.get("image", "")
        b64_image = p.get("image", "")
        
        if b64_image and (b64_image.startswith("data:") or len(b64_image) > 100):
            # It's a base64 image, upload it
            image_path = f"users/{uid}/products/{product_id}.jpg"
            try:
                image_url = await upload_base64_image(b64_image, product_id, image_path)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to upload image for product {product_id}: {str(e)}"
                )
        
        # Create product document
        product_doc = {
            "productId": product_id,
            "userId": uid,
            "image": image_url,
            "productChineseName": p.get("productChineseName", ""),
            "productEnglishName": p.get("productEnglishName", ""),
            "unitPrice": p.get("unitPrice", ""),
            "unitMass": p.get("unitMass", {}),
            "material": p.get("material", ""),
            "hsCode": p.get("hsCode", ""),
            "packing": p.get("packing", ""),
            "packingVolume": p.get("packingVolume", {}),
            "packingMass": p.get("packingMass", {}),
            "saved": p.get("saved", False),
            "updatedAt": p.get("updatedAt", now),
            "supplierId": p.get("supplierId", ""),
            "additionalNotes": p.get("additionalNotes", ""),
            "clients": p.get("clients", []),
            "currency": p.get("currency", ""),
        }
        
        # Upsert product
        db.products.update_one(
            {"userId": uid, "productId": product_id},
            {"$set": product_doc},
            upsert=True
        )
        
        # Add productId to supplier
        supplier_id = p.get("supplierId")
        if supplier_id:
            db.suppliers.update_one(
                {"userId": uid, "supplierId": supplier_id},
                {"$addToSet": {"productIds": product_id}}
            )
        
        # Add productId to clients
        client_ids = p.get("clients", [])
        if client_ids:
            db.clients.update_many(
                {"userId": uid, "clientId": {"$in": client_ids}},
                {"$addToSet": {"productIds": product_id}}
            )
    
    # Broadcast updates via WebSocket
    await broadcast_to_user(uid, {"type": "sync", "action": "completed"})
    
    return {"success": True}
