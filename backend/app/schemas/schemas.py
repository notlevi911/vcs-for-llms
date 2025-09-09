from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

# Authentication schemas
class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Chat schemas
class ChatRequest(BaseModel):
    chatId: str = Field(..., description="Unique chat identifier")
    userMessage: str = Field(..., min_length=1, description="User's message")

class ChatResponse(BaseModel):
    chatId: str
    assistantMessage: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Commit schemas
class CommitRequest(BaseModel):
    chatId: str = Field(..., description="Chat to commit")
    name: str = Field(..., min_length=1, max_length=200, description="Commit name")

class CommitResponse(BaseModel):
    commitId: str
    chatId: str
    name: str
    timestamp: datetime
    messageCount: int = Field(..., description="Number of messages in commit")

# Fetch schemas
class FetchResponse(BaseModel):
    commitId: str
    chatId: str
    restoredMessages: List[dict] = Field(..., description="Restored messages")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Commit history schemas
class CommitHistoryItem(BaseModel):
    commitId: str
    name: str
    timestamp: datetime
    messageCount: int

class CommitHistoryResponse(BaseModel):
    chatId: str
    commits: List[CommitHistoryItem]
    totalCount: int
