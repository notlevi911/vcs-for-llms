from fastapi import APIRouter
from app.api.v1.api import api_router as v1_router

api_router = APIRouter()

# Include versioned routers
api_router.include_router(v1_router, prefix="/v1")
