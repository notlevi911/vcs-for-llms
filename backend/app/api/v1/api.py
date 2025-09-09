from fastapi import APIRouter
from app.api.v1 import auth, chat, commits

api_router = APIRouter()

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(chat.router)
api_router.include_router(commits.router)
