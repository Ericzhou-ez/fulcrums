from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class User(BaseModel):
    uid: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    photo: Optional[str] = None
    role: Optional[str] = None
    createdAt: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    photo: Optional[str] = None
    role: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    photo: Optional[str] = None
    role: Optional[str] = None
