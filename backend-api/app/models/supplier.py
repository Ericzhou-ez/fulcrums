from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class Supplier(BaseModel):
    supplierId: str
    userId: str
    supplierName: str
    supplierPhone: Optional[str] = None
    supplierAddress: Optional[str] = None
    supplierEmail: Optional[EmailStr] = None
    productIds: List[str] = []
    updatedAt: datetime

    class Config:
        from_attributes = True


class SupplierCreate(BaseModel):
    supplierName: str
    supplierPhone: Optional[str] = None
    supplierAddress: Optional[str] = None
    supplierEmail: Optional[EmailStr] = None


class SupplierUpdate(BaseModel):
    supplierName: Optional[str] = None
    supplierPhone: Optional[str] = None
    supplierAddress: Optional[str] = None
    supplierEmail: Optional[EmailStr] = None
