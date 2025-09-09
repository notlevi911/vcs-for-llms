from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
import os, json

class Settings(BaseSettings):
    # Pydantic v2 settings config
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",  # ignore unknown envs (e.g., LANGCHAIN_TRACING_V2)
    )

    # Database
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "promptpilot"
    
    # Ollama Configuration
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    
    # Security
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS (can be CSV or JSON array in .env)
    allowed_origins: Union[List[str], str] = ["http://localhost:5173", "http://localhost:3000"]

    def normalized_allowed_origins(self) -> List[str]:
        value = self.allowed_origins
        if isinstance(value, list):
            return value
        if isinstance(value, str):
            s = value.strip()
            if s.startswith('['):
                try:
                    arr = json.loads(s)
                    if isinstance(arr, list):
                        return [str(x) for x in arr]
                except Exception:
                    pass
            return [v.strip() for v in s.split(',') if v.strip()]
        return ["http://localhost:5173"]

settings = Settings()
