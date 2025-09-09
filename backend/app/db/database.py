from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
from app.core.config import settings

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database: Optional[AsyncIOMotorDatabase] = None

db = Database()

async def get_database() -> AsyncIOMotorDatabase:
    """Get database instance"""
    if db.database is None:
        await connect_to_mongo()
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    try:
        db.client = AsyncIOMotorClient(settings.mongodb_url)
        db.database = db.client[settings.database_name]
        
        # Test connection
        await db.client.admin.command('ping')
        print(f"✅ Connected to MongoDB: {settings.database_name}")
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("🔌 MongoDB connection closed")

# Create indexes for better performance
async def create_indexes():
    """Create database indexes"""
    try:
        database = await get_database()
        
        # Users collection indexes
        await database.users.create_index("email", unique=True)
        
        # Chats collection indexes
        await database.chats.create_index("chatId")
        await database.chats.create_index("userId")
        
        # Commits collection indexes
        await database.commits.create_index("commitId", unique=True)
        await database.commits.create_index("chatId")
        await database.commits.create_index("timestamp")
        
        print("📊 Database indexes created successfully")
        
    except Exception as e:
        print(f"❌ Failed to create indexes: {e}")
        raise
