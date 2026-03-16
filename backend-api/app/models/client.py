from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class Client(BaseModel):
    clientId: str
    userId: str
    companyName: str
    vatNumber: Optional[str] = None
    eoriNumber: Optional[str] = None
    address: str
    contactName: str
    contactPhoneNumber: str
    contactEmail: Optional[EmailStr] = None
    productIds: List[str] = []
    updatedAt: datetime

    class Config:
        from_attributes = True


class ClientCreate(BaseModel):
    companyName: str
    vatNumber: Optional[str] = None
    eoriNumber: Optional[str] = None
    address: str
    contactName: str
    contactPhoneNumber: str
    contactEmail: Optional[EmailStr] = None


class ClientUpdate(BaseModel):
    companyName: Optional[str] = None
    vatNumber: Optional[str] = None
    eoriNumber: Optional[str] = None
    address: Optional[str] = None
    contactName: Optional[str] = None
    contactPhoneNumber: Optional[str] = None
    contactEmail: Optional[EmailStr] = None
