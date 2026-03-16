from pymongo import MongoClient
from pymongo.database import Database
from app.config import settings

client: MongoClient | None = None
database: Database | None = None


def get_database() -> Database:
    """Get MongoDB database instance."""
    global database
    if database is None:
        raise RuntimeError("Database not initialized. Call init_database() first.")
    return database


def init_database():
    """Initialize MongoDB connection."""
    global client, database
    if client is None:
        client = MongoClient(settings.mongodb_uri)
        database = client.get_database()
        # Create indexes
        create_indexes()


def create_indexes():
    """Create necessary indexes for collections."""
    db = get_database()
    
    # Users collection
    db.users.create_index("uid", unique=True)
    
    # Products collection
    db.products.create_index("userId")
    db.products.create_index([("userId", 1), ("productId", 1)], unique=True)
    
    # Clients collection
    db.clients.create_index("userId")
    db.clients.create_index([("userId", 1), ("clientId", 1)], unique=True)
    
    # Suppliers collection
    db.suppliers.create_index("userId")
    db.suppliers.create_index([("userId", 1), ("supplierId", 1)], unique=True)
    
    # Orders collection
    db.orders.create_index("userId")
    db.orders.create_index([("userId", 1), ("orderId", 1)], unique=True)


def close_database():
    """Close MongoDB connection."""
    global client, database
    if client:
        client.close()
        client = None
        database = None
