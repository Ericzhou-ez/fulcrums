import re
import base64
from firebase_admin import storage
from app.config import settings


def parse_base64_image(image_input: str) -> tuple[str, bytes]:
    """
    Parse base64 image string.
    
    Args:
        image_input: Base64 image string (with or without data URI prefix)
        
    Returns:
        Tuple of (mime_type, image_bytes)
    """
    # Try to match data URI format: data:image/jpeg;base64,...
    match = re.match(r"^data:(image/[a-z]+);base64,(.+)$", image_input, re.IGNORECASE)
    
    if match:
        mime = match.group(1)
        data = match.group(2).replace(" ", "")
    else:
        # Assume raw base64 string and default to jpeg
        mime = "image/jpeg"
        data = image_input.replace(" ", "")
    
    try:
        image_bytes = base64.b64decode(data)
        if len(image_bytes) == 0:
            raise ValueError("Image buffer is empty")
        return mime, image_bytes
    except Exception as e:
        raise ValueError(f"Failed to decode base64 image: {str(e)}")


async def upload_blob_as_jpg(
    image_input: str,
    token: str,
    path: str
) -> str:
    """
    Upload a base64 image to Firebase Storage as JPG.
    
    Args:
        image_input: Base64 image string
        token: Token to use for the file (typically productId)
        path: Storage path (e.g., "users/{uid}/products/{productId}.jpg")
        
    Returns:
        Public URL of the uploaded image
    """
    try:
        mime, buffer = parse_base64_image(image_input)
        
        bucket = storage.bucket(settings.firebase_storage_bucket)
        blob = bucket.blob(path)
        
        # Upload the file
        blob.upload_from_string(
            buffer,
            content_type=mime,
            metadata={
                "firebaseStorageDownloadTokens": token
            }
        )
        
        # Generate public URL
        public_url = (
            f"https://firebasestorage.googleapis.com/v0/b/{bucket.name}/o/"
            f"{path.replace('/', '%2F')}?alt=media&token={token}"
        )
        
        return public_url
    except Exception as e:
        raise RuntimeError(f"Failed to upload image: {str(e)}")
