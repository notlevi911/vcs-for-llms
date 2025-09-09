import uuid
from datetime import datetime
from typing import List, Dict, Any
from motor.motor_asyncio import AsyncIOMotorDatabase

from langchain.memory import ConversationBufferMemory
from langchain_community.llms import Ollama
from langchain.schema import HumanMessage, AIMessage

from app.core.config import settings
from app.models.models import Chat, Commit, Message
from app.schemas.schemas import ChatResponse, CommitResponse, FetchResponse, CommitHistoryResponse, CommitHistoryItem

class ChatService:
    def __init__(self):
        self.ollama_model = settings.ollama_model
        self.ollama_base_url = settings.ollama_base_url
        
        # Initialize Ollama LLM
        self.llm = Ollama(
            model=self.ollama_model,
            base_url=self.ollama_base_url,
            temperature=0.7,
            top_p=0.9,
        )
    
    async def ensure_chat_exists(self, chat_id: str, user_id: str, db: AsyncIOMotorDatabase):
        chat = await db.chats.find_one({"chatId": chat_id, "userId": user_id})
        if not chat:
            await db.chats.insert_one({
                "chatId": chat_id,
                "userId": user_id,
                "name": "Untitled",
                "messages": [],
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
            })
    
    async def list_chats(self, user_id: str, db: AsyncIOMotorDatabase) -> List[Dict[str, Any]]:
        cursor = db.chats.find({"userId": user_id}).sort("updated_at", -1)
        items: List[Dict[str, Any]] = []
        async for doc in cursor:
            items.append({
                "chatId": doc.get("chatId"),
                "name": doc.get("name", "Untitled"),
                "updatedAt": doc.get("updated_at"),
            })
        return items
    
    async def create_chat(self, user_id: str, db: AsyncIOMotorDatabase, name: str | None = None) -> Dict[str, Any]:
        chat_id = str(uuid.uuid4())
        doc = {
            "chatId": chat_id,
            "userId": user_id,
            "name": name or "Untitled",
            "messages": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await db.chats.insert_one(doc)
        return {"chatId": chat_id, "name": doc["name"], "updatedAt": doc["updated_at"]}

    async def get_chat_messages(self, chat_id: str, user_id: str, db: AsyncIOMotorDatabase) -> List[Dict[str, Any]]:
        chat = await db.chats.find_one({"chatId": chat_id, "userId": user_id})
        if not chat:
            return []
        return chat.get("messages", [])

    async def process_message(
        self, 
        chat_id: str, 
        user_message: str, 
        user_id: str, 
        db: AsyncIOMotorDatabase
    ) -> ChatResponse:
        
        # Get or create chat
        await self.ensure_chat_exists(chat_id, user_id, db)
        chat = await db.chats.find_one({"chatId": chat_id, "userId": user_id})
        
        # Create memory from existing messages
        memory = ConversationBufferMemory(return_messages=True)
        for msg in chat.get("messages", []):
            if msg["role"] == "user":
                memory.chat_memory.add_user_message(msg["content"])
            elif msg["role"] == "assistant":
                memory.chat_memory.add_ai_message(msg["content"])
        
        # Add new user message
        memory.chat_memory.add_user_message(user_message)
        
        # Get AI response
        try:
            conversation_history = memory.chat_memory.messages
            prompt = self._create_prompt(conversation_history, user_message)
            ai_response = await self._get_ai_response(prompt)
        except Exception as e:
            ai_response = f"I apologize, but I'm having trouble processing your request right now. Error: {str(e)}"
        
        # Add AI response to memory
        memory.chat_memory.add_ai_message(ai_response)
        
        # Update chat in database
        updated_messages = []
        for msg in memory.chat_memory.messages:
            if isinstance(msg, HumanMessage):
                updated_messages.append({
                    "role": "user",
                    "content": msg.content,
                    "timestamp": datetime.utcnow()
                })
            elif isinstance(msg, AIMessage):
                updated_messages.append({
                    "role": "assistant", 
                    "content": msg.content,
                    "timestamp": datetime.utcnow()
                })
        
        await db.chats.update_one(
            {"chatId": chat_id, "userId": user_id},
            {"$set": {"messages": updated_messages, "updated_at": datetime.utcnow()}}
        )
        
        return ChatResponse(chatId=chat_id, assistantMessage=ai_response, timestamp=datetime.utcnow())
    
    def _create_prompt(self, conversation_history: List, user_message: str) -> str:
        prompt = "You are PromptPilot, an AI-powered development assistant. You help developers with coding, debugging, architecture decisions, and technical questions.\n\n"
        if conversation_history:
            prompt += "Previous conversation:\n"
            for msg in conversation_history[:-1]:
                if isinstance(msg, HumanMessage):
                    prompt += f"Human: {msg.content}\n"
                elif isinstance(msg, AIMessage):
                    prompt += f"Assistant: {msg.content}\n"
            prompt += "\n"
        prompt += f"Human: {user_message}\n"
        prompt += "Assistant: "
        return prompt
    
    async def _get_ai_response(self, prompt: str) -> str:
        try:
            response = self.llm.invoke(prompt)
            return response.strip()
        except Exception as e:
            return f"I apologize, but I encountered an error while processing your request: {str(e)}"

class CommitService:
    async def create_commit(
        self,
        chat_id: str,
        name: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> CommitResponse:
        # Get current chat
        chat = await db.chats.find_one({"chatId": chat_id, "userId": user_id})
        if not chat:
            raise ValueError(f"Chat {chat_id} not found")
        
        commit_id = str(uuid.uuid4())
        commit_doc = {
            "commitId": commit_id,
            "chatId": chat_id,
            "userId": user_id,
            "name": name,
            "messages": chat["messages"],
            "timestamp": datetime.utcnow()
        }
        await db.commits.insert_one(commit_doc)
        
        return CommitResponse(
            commitId=commit_id,
            chatId=chat_id,
            name=name,
            timestamp=commit_doc["timestamp"],
            messageCount=len(chat["messages"])
        )
    
    async def fetch_commit(
        self,
        commit_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> FetchResponse:
        commit = await db.commits.find_one({"commitId": commit_id, "userId": user_id})
        if not commit:
            raise ValueError(f"Commit {commit_id} not found")
        
        chat_id = commit["chatId"]
        commit_timestamp = commit["timestamp"]
        await db.commits.delete_many({"chatId": chat_id, "userId": user_id, "timestamp": {"$gt": commit_timestamp}})
        await db.chats.update_one(
            {"chatId": chat_id, "userId": user_id},
            {"$set": {"messages": commit["messages"], "updated_at": datetime.utcnow()}}
        )
        
        return FetchResponse(commitId=commit_id, chatId=chat_id, restoredMessages=commit["messages"], timestamp=datetime.utcnow())
    
    async def get_commit_history(
        self,
        chat_id: str,
        user_id: str,
        db: AsyncIOMotorDatabase
    ) -> CommitHistoryResponse:
        commits_cursor = db.commits.find({"chatId": chat_id, "userId": user_id}).sort("timestamp", -1)
        commits = []
        async for commit in commits_cursor:
            commits.append(CommitHistoryItem(commitId=commit["commitId"], name=commit["name"], timestamp=commit["timestamp"], messageCount=len(commit["messages"])) )
        return CommitHistoryResponse(chatId=chat_id, commits=commits, totalCount=len(commits))
