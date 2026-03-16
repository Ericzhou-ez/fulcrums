from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.product import Product, ProductCreate, ProductUpdate
from app.utils.firebase_storage import upload_blob_as_jpg
from app.routers.websocket import broadcast_to_user
from firebase_admin import storage

router = APIRouter(prefix="/products", tags=["products"])


def validate_product_data(data: ProductCreate, errors: List[str]):
    """Validate product creation data."""
    required_fields = {
        "productChineseName": data.productChineseName,
        "productEnglishName": data.productEnglishName,
        "unitPrice": data.unitPrice,
        "packing": data.packing,
        "supplierId": data.supplierId,
    }
    
    for field, value in required_fields.items():
        if not value or (isinstance(value, str) and value.strip() == ""):
            errors.append(f"{field} 不能为空")
    
    if data.packingVolume:
        for field in ["length", "width", "height", "packingUnit"]:
            value = getattr(data.packingVolume, field, None)
            if not value or (isinstance(value, str) and value.strip() == ""):
                errors.append(f"{field} 不能为空")
    
    if len(data.clients) > 50:
        errors.append("Too many clients assigned")
    
    if not data.image:
        errors.append("No product image")
    
    for client_id in data.clients:
        if len(client_id) > 100:
            errors.append(f"{client_id} is not a valid client ID")


@router.get("", response_model=List[Product])
async def get_products(
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get all products for the current user."""
    products = list(db.products.find({"userId": uid}))
    return [Product(**p) for p in products]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_product(
    product_data: ProductCreate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Create a new product."""
    errors = []
    validate_product_data(product_data, errors)
    
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors)
        )
    
    # Validate clients exist
    if product_data.clients:
        client_ids = product_data.clients
        client_count = db.clients.count_documents({
            "userId": uid,
            "clientId": {"$in": client_ids}
        })
        if client_count != len(client_ids):
            invalid_clients = set(client_ids) - set(
                c["clientId"] for c in db.clients.find(
                    {"userId": uid, "clientId": {"$in": client_ids}},
                    {"clientId": 1}
                )
            )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"以下客户不存在: {', '.join(invalid_clients)}"
            )
    
    # Validate supplier exists
    supplier = db.suppliers.find_one({
        "userId": uid,
        "supplierId": product_data.supplierId
    })
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"供应商 {product_data.supplierId} 不存在"
        )
    
    # Generate product ID
    product_id = str(ObjectId())
    now = datetime.utcnow()
    
    # Upload image
    image_path = f"users/{uid}/products/{product_id}.jpg"
    image_url = await upload_blob_as_jpg(
        product_data.image,
        product_id,
        image_path
    )
    
    # Create product document
    product_doc = {
        "productId": product_id,
        "userId": uid,
        "image": image_url,
        "productChineseName": product_data.productChineseName,
        "productEnglishName": product_data.productEnglishName,
        "unitPrice": product_data.unitPrice,
        "unitMass": product_data.unitMass.model_dump(),
        "material": product_data.material,
        "hsCode": product_data.hsCode,
        "packing": product_data.packing,
        "packingVolume": product_data.packingVolume.model_dump(),
        "packingMass": product_data.packingMass.model_dump(),
        "saved": product_data.saved,
        "updatedAt": product_data.updatedAt or now,
        "supplierId": product_data.supplierId,
        "additionalNotes": product_data.additionalNotes or "",
        "clients": product_data.clients,
        "currency": product_data.currency,
    }
    
    db.products.insert_one(product_doc)
    
    # Add productId to clients
    if product_data.clients:
        db.clients.update_many(
            {"userId": uid, "clientId": {"$in": product_data.clients}},
            {"$addToSet": {"productIds": product_id}}
        )
    
    # Add productId to supplier
    db.suppliers.update_one(
        {"userId": uid, "supplierId": product_data.supplierId},
        {"$addToSet": {"productIds": product_id}}
    )
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "products", "action": "created", "productId": product_id})
    
    return {"success": True, "productId": product_id}


@router.get("/{product_id}", response_model=Product)
async def get_product(
    product_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get a specific product."""
    product = db.products.find_one({
        "userId": uid,
        "productId": product_id
    })
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"产品 {product_id} 不存在"
        )
    
    return Product(**product)


@router.patch("/{product_id}", response_model=Product)
async def update_product(
    product_id: str,
    product_data: ProductUpdate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update a product."""
    product = db.products.find_one({
        "userId": uid,
        "productId": product_id
    })
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"产品 {product_id} 不存在"
        )
    
    update_data = {}
    
    # Handle image update
    if product_data.image and product_data.image != "none":
        # Delete old image if exists
        if product.get("image"):
            try:
                bucket = storage.bucket()
                # Extract path from URL
                old_url = product["image"]
                if "firebasestorage.googleapis.com" in old_url:
                    # Parse and delete old image
                    pass  # Optional: implement image deletion
            except:
                pass
        
        # Upload new image
        image_path = f"users/{uid}/products/{product_id}.jpg"
        image_url = await upload_blob_as_jpg(
            product_data.image,
            product_id,
            image_path
        )
        update_data["image"] = image_url
    elif product_data.image == "none":
        # Keep existing image
        pass
    
    # Handle other fields
    for field, value in product_data.model_dump(exclude_unset=True, exclude={"image"}).items():
        if value is not None:
            if field in ["unitMass", "packingVolume", "packingMass"]:
                update_data[field] = value.model_dump() if hasattr(value, "model_dump") else value
            else:
                update_data[field] = value
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        db.products.update_one(
            {"userId": uid, "productId": product_id},
            {"$set": update_data}
        )
    
    # Handle supplier change
    if product_data.supplierId and product_data.supplierId != product.get("supplierId"):
        old_supplier_id = product.get("supplierId")
        if old_supplier_id:
            db.suppliers.update_one(
                {"userId": uid, "supplierId": old_supplier_id},
                {"$pull": {"productIds": product_id}}
            )
        db.suppliers.update_one(
            {"userId": uid, "supplierId": product_data.supplierId},
            {"$addToSet": {"productIds": product_id}}
        )
    
    # Handle clients change
    if product_data.clients is not None:
        old_clients = set(product.get("clients", []))
        new_clients = set(product_data.clients)
        
        # Remove from old clients
        removed_clients = old_clients - new_clients
        if removed_clients:
            db.clients.update_many(
                {"userId": uid, "clientId": {"$in": list(removed_clients)}},
                {"$pull": {"productIds": product_id}}
            )
        
        # Add to new clients
        added_clients = new_clients - old_clients
        if added_clients:
            db.clients.update_many(
                {"userId": uid, "clientId": {"$in": list(added_clients)}},
                {"$addToSet": {"productIds": product_id}}
            )
    
    updated_product = db.products.find_one({
        "userId": uid,
        "productId": product_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "products", "action": "updated", "productId": product_id})
    
    return Product(**updated_product)


@router.patch("/{product_id}/save")
async def toggle_save_product(
    product_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Toggle saved status of a product."""
    product = db.products.find_one({
        "userId": uid,
        "productId": product_id
    })
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="没有产品"
        )
    
    current_saved = product.get("saved", False)
    new_saved = not current_saved
    
    db.products.update_one(
        {"userId": uid, "productId": product_id},
        {"$set": {"saved": new_saved}}
    )
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "products", "action": "updated", "productId": product_id})
    
    return {"success": True, "saved": new_saved}


@router.delete("")
async def delete_products(
    product_ids: List[str],
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Delete multiple products."""
    if not product_ids or len(product_ids) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="必须提供一个有效的产品 ID array"
        )
    
    results = []
    
    for product_id in product_ids:
        try:
            product = db.products.find_one({
                "userId": uid,
                "productId": product_id
            })
            
            if not product:
                results.append({
                    "productId": product_id,
                    "status": "rejected",
                    "reason": f"产品 {product_id} 不存在"
                })
                continue
            
            # Delete image from Firebase Storage
            if product.get("image") and "firebasestorage.googleapis.com" in product.get("image", ""):
                try:
                    bucket = storage.bucket()
                    blob_path = f"users/{uid}/products/{product_id}.jpg"
                    blob = bucket.blob(blob_path)
                    blob.delete()
                except Exception as e:
                    # Log but don't fail
                    print(f"Failed to delete image: {e}")
            
            # Remove productId from clients
            clients = product.get("clients", [])
            if clients:
                db.clients.update_many(
                    {"userId": uid, "clientId": {"$in": clients}},
                    {"$pull": {"productIds": product_id}}
                )
            
            # Remove productId from supplier
            supplier_id = product.get("supplierId")
            if supplier_id:
                db.suppliers.update_one(
                    {"userId": uid, "supplierId": supplier_id},
                    {"$pull": {"productIds": product_id}}
                )
            
            # Delete product
            db.products.delete_one({
                "userId": uid,
                "productId": product_id
            })
            
            results.append({
                "productId": product_id,
                "status": "fulfilled",
                "reason": None
            })
        except Exception as e:
            results.append({
                "productId": product_id,
                "status": "rejected",
                "reason": str(e)
            })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "products", "action": "deleted", "productIds": product_ids})
    
    return {"success": True, "summary": results}
