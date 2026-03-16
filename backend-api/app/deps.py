from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
from app.config import settings
import os

security = HTTPBearer()


def init_firebase_admin():
    """Initialize Firebase Admin SDK."""
    if not firebase_admin._apps:
        if settings.firebase_service_account_path and os.path.exists(settings.firebase_service_account_path):
            cred = credentials.Certificate(settings.firebase_service_account_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': settings.firebase_storage_bucket
            })
        else:
            # Try to initialize with default credentials (e.g., from environment)
            try:
                firebase_admin.initialize_app(options={
                    'storageBucket': settings.firebase_storage_bucket
                })
            except Exception as e:
                raise RuntimeError(f"Failed to initialize Firebase Admin: {e}")


async def get_uid_from_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """
    Verify Firebase ID token and return the user's UID.
    
    Args:
        credentials: HTTP Bearer token from Authorization header
        
    Returns:
        str: User's UID
        
    Raises:
        HTTPException: If token is invalid or missing
    """
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no UID found"
            )
        
        return uid
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
