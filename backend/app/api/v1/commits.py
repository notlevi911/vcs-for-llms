from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.schemas import CommitRequest, CommitResponse, FetchResponse, CommitHistoryResponse
from app.core.auth import get_current_user
from app.services.services import CommitService
from app.db.database import get_database
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/commits", tags=["commits"])
commit_service = CommitService()

@router.post("/commit", response_model=CommitResponse)
async def commit(
    request: CommitRequest,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Save current chat state as a commit"""
    try:
        response = await commit_service.create_commit(
            chat_id=request.chatId,
            name=request.name,
            user_id=current_user["id"],
            db=db
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Commit creation failed: {str(e)}"
        )

@router.post("/fetch/{commit_id}", response_model=FetchResponse)
async def fetch_commit(
    commit_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Restore chat state from a commit"""
    try:
        response = await commit_service.fetch_commit(
            commit_id=commit_id,
            user_id=current_user["id"],
            db=db
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Commit fetch failed: {str(e)}"
        )

@router.get("/{chat_id}", response_model=CommitHistoryResponse)
async def get_commit_history(
    chat_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get commit history for a chat"""
    try:
        response = await commit_service.get_commit_history(
            chat_id=chat_id,
            user_id=current_user["id"],
            db=db
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get commit history: {str(e)}"
        )
