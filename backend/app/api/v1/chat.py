from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import ChatRequest, ChatResponse
from app.core.auth import get_current_user
from app.services.services import ChatService
from app.db.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Any, Dict, List

router = APIRouter(prefix="/chat", tags=["chat"])
chat_service = ChatService()

@router.get("/list")
async def list_chats(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    items = await chat_service.list_chats(current_user["id"], db)
    return {"chats": items}

@router.post("/new")
async def new_chat(current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    # Auto-name like Chat One, Chat Two based on count
    items = await chat_service.list_chats(current_user["id"], db)
    name = f"Chat {len(items) + 1}"
    created = await chat_service.create_chat(current_user["id"], db, name=name)
    return created

@router.get("/{chat_id}/messages")
async def get_messages(chat_id: str, current_user: dict = Depends(get_current_user), db: AsyncIOMotorDatabase = Depends(get_database)):
    messages = await chat_service.get_chat_messages(chat_id, current_user["id"], db)
    return {"chatId": chat_id, "messages": messages}

@router.post("", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    try:
        response = await chat_service.process_message(chat_id=request.chatId, user_message=request.userMessage, user_id=current_user["id"], db=db)
        return response
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Chat processing failed: {str(e)}")
