from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.api.api import api_router
from app.db.database import connect_to_mongo, close_mongo_connection, create_indexes

# Initialize FastAPI app
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting PromptPilot Backend...")
    print(f"📊 Database: {settings.database_name}")
    print(f"🤖 Ollama Model: {settings.ollama_model}")
    
    # Connect to database and create indexes
    await connect_to_mongo()
    await create_indexes()
    
    yield
    
    # Shutdown
    await close_mongo_connection()
    print("👋 Shutting down PromptPilot Backend...")

app = FastAPI(
    title="PromptPilot API",
    description="AI-Powered Development Assistant Backend",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.normalized_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to PromptPilot API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "PromptPilot Backend"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
