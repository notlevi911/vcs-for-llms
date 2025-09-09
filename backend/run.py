#!/usr/bin/env python3
"""
PromptPilot Backend Startup Script
"""

import asyncio
import subprocess
import sys
import os
from pathlib import Path

def check_ollama():
    """Check if Ollama is running and has the required model"""
    try:
        import requests
        from app.core.config import settings
        
        response = requests.get(f"{settings.ollama_base_url}/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json().get("models", [])
            model_names = [model["name"] for model in models]
            
            required_model = settings.ollama_model
            if required_model in model_names:
                print(f"✅ Ollama is running with {required_model} model")
                return True
            else:
                print(f"❌ Ollama is running but {required_model} model not found")
                print(f"Available models: {', '.join(model_names)}")
                print(f"Run: ollama pull {required_model}")
                return False
        else:
            print("❌ Ollama is not responding")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        print("Make sure Ollama is running: ollama serve")
        return False

def check_mongodb():
    """Check if MongoDB is accessible"""
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        import asyncio
        from app.core.config import settings
        
        async def test_connection():
            client = AsyncIOMotorClient(settings.mongodb_url)
            await client.admin.command('ping')
            client.close()
            return True
        
        result = asyncio.run(test_connection())
        if result:
            print("✅ MongoDB is accessible")
            return True
    except Exception as e:
        print(f"❌ Cannot connect to MongoDB: {e}")
        print("Make sure MongoDB is running")
        return False

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False

def main():
    """Main startup function"""
    print("🚀 PromptPilot Backend Startup")
    print("=" * 40)
    
    # Check if we're in the right directory
    if not Path("requirements.txt").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    # Check external services
    print("\n🔍 Checking external services...")
    
    mongodb_ok = check_mongodb()
    ollama_ok = check_ollama()
    
    if not mongodb_ok or not ollama_ok:
        print("\n❌ External services are not ready")
        print("Please fix the issues above and try again")
        sys.exit(1)
    
    print("\n✅ All services are ready!")
    print("\n🚀 Starting PromptPilot Backend...")
    print("API will be available at: http://localhost:8000")
    print("API docs will be available at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    # Start the FastAPI server
    try:
        import uvicorn
        uvicorn.run(
            "main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n👋 Shutting down PromptPilot Backend...")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
