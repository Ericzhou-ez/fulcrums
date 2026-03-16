from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime
from app.deps import get_uid_from_token
from app.db import get_database
from app.models.user import User, UserCreate, UserUpdate
from pymongo.database import Database

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=User)
async def get_current_user(
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Get current user profile."""
    user_doc = db.users.find_one({"uid": uid})
    
    if not user_doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    
    return User(**user_doc)


@router.post("/me", response_model=User)
async def create_user_profile(
    user_data: UserCreate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Create or update user profile."""
    now = datetime.utcnow()
    
    user_doc = {
        "uid": uid,
        "name": user_data.name,
        "email": user_data.email,
        "photo": user_data.photo,
        "role": user_data.role,
        "createdAt": now
    }
    
    # Upsert user document
    db.users.update_one(
        {"uid": uid},
        {"$set": user_doc},
        upsert=True
    )
    
    return User(**user_doc)


@router.put("/me", response_model=User)
async def update_user_profile(
    user_data: UserUpdate,
    uid: str = Depends(get_uid_from_token),
    db: Database = Depends(get_database)
):
    """Update user profile."""
    update_data = {k: v for k, v in user_data.model_dump(exclude_unset=True).items() if v is not None}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields to update"
        )
    
    result = db.users.find_one_and_update(
        {"uid": uid},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found"
        )
    
    return User(**result)
