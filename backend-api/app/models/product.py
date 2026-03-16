from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class Mass(BaseModel):
    unitMassQuantity: str
    unitMassUnit: str


class VolumetricDimensions(BaseModel):
    length: str
    width: str
    height: str
    packingUnit: str


class PackingMass(BaseModel):
    packingMassQuantity: str
    packingMassUnit: str


class Product(BaseModel):
    productId: str
    userId: str
    image: str
    productChineseName: str
    productEnglishName: str
    unitPrice: str
    unitMass: Mass
    material: str
    hsCode: str
    packing: str
    packingVolume: VolumetricDimensions
    packingMass: PackingMass
    saved: bool
    updatedAt: datetime
    supplierId: str
    additionalNotes: Optional[str] = ""
    clients: List[str] = []
    currency: str

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    image: str
    productChineseName: str
    productEnglishName: str
    unitPrice: str
    unitMass: Mass
    material: str
    hsCode: str
    packing: str
    packingVolume: VolumetricDimensions
    packingMass: PackingMass
    saved: bool = False
    updatedAt: Optional[datetime] = None
    supplierId: str
    additionalNotes: Optional[str] = ""
    clients: List[str] = []
    currency: str


class ProductUpdate(BaseModel):
    image: Optional[str] = None
    productChineseName: Optional[str] = None
    productEnglishName: Optional[str] = None
    unitPrice: Optional[str] = None
    unitMass: Optional[Mass] = None
    material: Optional[str] = None
    hsCode: Optional[str] = None
    packing: Optional[str] = None
    packingVolume: Optional[VolumetricDimensions] = None
    packingMass: Optional[PackingMass] = None
    saved: Optional[bool] = None
    updatedAt: Optional[datetime] = None
    supplierId: Optional[str] = None
    additionalNotes: Optional[str] = None
    clients: Optional[List[str]] = None
    currency: Optional[str] = None
