from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db import init_database, close_database
from app.deps import init_firebase_admin
from app.routers import users, products, clients, suppliers, orders, sync, websocket

# Initialize Firebase Admin
init_firebase_admin()

# Initialize database
init_database()

app = FastAPI(
    title="Fulcrums API",
    description="FastAPI backend for Fulcrums - migrated from Firebase",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(products.router)
app.include_router(clients.router)
app.include_router(suppliers.router)
app.include_router(orders.router)
app.include_router(sync.router)
app.include_router(websocket.router)


@app.on_event("shutdown")
async def shutdown_event():
    """Clean up on shutdown."""
    close_database()


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Fulcrums API", "version": "1.0.0"}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
