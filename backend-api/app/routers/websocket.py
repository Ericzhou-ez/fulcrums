from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, Depends
from typing import Dict, Set
import json
import asyncio
from app.deps import get_uid_from_token
import firebase_admin
from firebase_admin import auth

router = APIRouter()

# Store active WebSocket connections per user
active_connections: Dict[str, Set[WebSocket]] = {}


async def verify_websocket_token(token: str) -> str:
    """Verify Firebase token and return UID."""
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        if not uid:
            raise ValueError("No UID in token")
        return uid
    except Exception as e:
        raise ValueError(f"Invalid token: {str(e)}")


async def broadcast_to_user(uid: str, message: dict):
    """Broadcast a message to all WebSocket connections for a user."""
    if uid in active_connections:
        disconnected = set()
        for connection in active_connections[uid]:
            try:
                await connection.send_json(message)
            except WebSocketDisconnect:
                disconnected.add(connection)
            except Exception as e:
                print(f"Error sending WebSocket message: {e}")
                disconnected.add(connection)
        
        # Remove disconnected connections
        active_connections[uid] -= disconnected
        if not active_connections[uid]:
            del active_connections[uid]


@router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...)
):
    """WebSocket endpoint for real-time updates."""
    uid = None
    try:
        # Verify token and get UID
        uid = await verify_websocket_token(token)
        
        # Accept connection
        await websocket.accept()
        
        # Add to active connections
        if uid not in active_connections:
            active_connections[uid] = set()
        active_connections[uid].add(websocket)
        
        # Send welcome message
        await websocket.send_json({
            "type": "connected",
            "message": "WebSocket connection established"
        })
        
        # Keep connection alive and handle messages
        while True:
            try:
                # Wait for messages (client can send ping/pong)
                data = await websocket.receive_text()
                try:
                    message = json.loads(data)
                    if message.get("type") == "ping":
                        await websocket.send_json({"type": "pong"})
                except:
                    pass
            except WebSocketDisconnect:
                break
            except Exception as e:
                print(f"WebSocket error: {e}")
                break
    except ValueError as e:
        try:
            await websocket.close(code=1008, reason=str(e))
        except:
            pass
    except Exception as e:
        try:
            await websocket.close(code=1011, reason=f"Internal error: {str(e)}")
        except:
            pass
    finally:
        # Remove from active connections
        if uid and uid in active_connections:
            active_connections[uid].discard(websocket)
            if not active_connections[uid]:
                del active_connections[uid]


# Export broadcast function for use in other routers
__all__ = ["router", "broadcast_to_user"]
