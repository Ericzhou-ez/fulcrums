from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId
from pymongo.database import Database
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.supplier import Supplier, SupplierCreate, SupplierUpdate
from app.routers.websocket import broadcast_to_user

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


@router.get("", response_model=List[Supplier])
async def get_suppliers(
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get all suppliers for the current user."""
    suppliers = list(db.suppliers.find({"userId": uid}))
    return [Supplier(**s) for s in suppliers]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_supplier(
    supplier_data: SupplierCreate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Create a new supplier."""
    supplier_id = str(ObjectId())
    now = datetime.utcnow()
    
    supplier_doc = {
        "supplierId": supplier_id,
        "userId": uid,
        "supplierName": supplier_data.supplierName,
        "supplierPhone": supplier_data.supplierPhone,
        "supplierAddress": supplier_data.supplierAddress,
        "supplierEmail": supplier_data.supplierEmail,
        "productIds": [],
        "updatedAt": now,
    }
    
    db.suppliers.insert_one(supplier_doc)
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "suppliers", "action": "created", "supplierId": supplier_id})
    
    return {"success": True, "supplierId": supplier_id}


@router.get("/{supplier_id}", response_model=Supplier)
async def get_supplier(
    supplier_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get a specific supplier."""
    supplier = db.suppliers.find_one({
        "userId": uid,
        "supplierId": supplier_id
    })
    
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"供应商 {supplier_id} 不存在"
        )
    
    return Supplier(**supplier)


@router.patch("/{supplier_id}", response_model=Supplier)
async def update_supplier(
    supplier_id: str,
    supplier_data: SupplierUpdate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update a supplier."""
    supplier = db.suppliers.find_one({
        "userId": uid,
        "supplierId": supplier_id
    })
    
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"供应商 {supplier_id} 不存在"
        )
    
    update_data = {k: v for k, v in supplier_data.model_dump(exclude_unset=True).items() if v is not None}
    
    if update_data:
        update_data["updatedAt"] = datetime.utcnow()
        db.suppliers.update_one(
            {"userId": uid, "supplierId": supplier_id},
            {"$set": update_data}
        )
    
    updated_supplier = db.suppliers.find_one({
        "userId": uid,
        "supplierId": supplier_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "suppliers", "action": "updated", "supplierId": supplier_id})
    
    return Supplier(**updated_supplier)


@router.delete("/{supplier_id}")
async def delete_supplier(
    supplier_id: str,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Delete a supplier."""
    supplier = db.suppliers.find_one({
        "userId": uid,
        "supplierId": supplier_id
    })
    
    if not supplier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"供应商 {supplier_id} 不存在"
        )
    
    db.suppliers.delete_one({
        "userId": uid,
        "supplierId": supplier_id
    })
    
    # Broadcast update via WebSocket
    await broadcast_to_user(uid, {"type": "suppliers", "action": "deleted", "supplierId": supplier_id})
    
    return {"success": True}
