from pydantic import BaseModel
from typing import List, Literal
from datetime import datetime


OrderStatus = Literal["draft", "shipped", "customs_clearance", "delivered", "cancelled"]
TransportMode = Literal["sea", "air", "road", "rail"]


class OrderProductLineItem(BaseModel):
    productId: str
    quantity: int


class Order(BaseModel):
    orderId: str
    userId: str
    orderName: str
    clientId: str
    products: List[OrderProductLineItem]
    incoterms: str
    portOfLoading: str
    portOfDischarge: str
    transportMode: TransportMode
    estimatedShipmentDate: str
    createdAt: datetime
    updatedAt: datetime
    status: OrderStatus

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    orderName: str
    clientId: str
    products: List[OrderProductLineItem]
    incoterms: str
    portOfLoading: str
    portOfDischarge: str
    transportMode: TransportMode
    estimatedShipmentDate: str


class OrderUpdate(BaseModel):
    orderName: Optional[str] = None
    clientId: Optional[str] = None
    products: Optional[List[OrderProductLineItem]] = None
    incoterms: Optional[str] = None
    portOfLoading: Optional[str] = None
    portOfDischarge: Optional[str] = None
    transportMode: Optional[TransportMode] = None
    estimatedShipmentDate: Optional[str] = None
    status: Optional[OrderStatus] = None
