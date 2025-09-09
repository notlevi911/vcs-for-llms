from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

class Message(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    role: str = Field(..., description="Role of the message sender (user/assistant)")
    content: str = Field(..., description="Content of the message")
    timestamp: Optional[datetime] = Field(default_factory=datetime.utcnow)

class User(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[str] = Field(default=None, alias="_id")
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r'^[^@]+@[^@]+\.[^@]+$')
    password_hash: str = Field(..., alias="passwordHash")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Chat(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[str] = Field(default=None, alias="_id")
    chatId: str = Field(..., description="Unique chat identifier")
    userId: str = Field(..., description="User who owns this chat")
    messages: List[Message] = Field(default_factory=list, description="List of messages in the chat")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Commit(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    id: Optional[str] = Field(default=None, alias="_id")
    commitId: str = Field(..., description="Unique commit identifier")
    chatId: str = Field(..., description="Chat this commit belongs to")
    userId: str = Field(..., description="User who created this commit")
    name: str = Field(..., min_length=1, max_length=200, description="Commit name/description")
    messages: List[Message] = Field(..., description="Snapshot of messages at commit time")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
