# PromptPilot Backend

AI-Powered Development Assistant Backend built with FastAPI, LangChain, Ollama, and MongoDB.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp env_example.txt .env

# Run the application
python run.py
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── auth.py      # Authentication endpoints
│   │   │   ├── chat.py      # Chat endpoints
│   │   │   ├── commits.py    # Commit endpoints
│   │   │   └── api.py       # API router
│   │   └── api.py           # Main API router
│   ├── core/
│   │   ├── config.py        # Configuration settings
│   │   └── auth.py          # Authentication logic
│   ├── db/
│   │   └── database.py      # Database connection
│   ├── models/
│   │   └── models.py        # Database models
│   ├── schemas/
│   │   └── schemas.py        # Pydantic schemas
│   └── services/
│       └── services.py       # Business logic
├── main.py                   # FastAPI application
├── run.py                    # Startup script
├── test_api.py              # API tests
└── requirements.txt         # Dependencies
```

## API Endpoints

- `POST /v1/auth/register` - Register user
- `POST /v1/auth/login` - Login user
- `POST /v1/chat` - Send message to AI
- `POST /v1/commits/commit` - Save chat state
- `POST /v1/commits/fetch/{commit_id}` - Restore chat state
- `GET /v1/commits/{chat_id}` - Get commit history

## Prerequisites

- Python 3.8+
- MongoDB
- Ollama with Llama3 model

## Configuration

Edit `.env` file with your settings:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=promptpilot
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:5173
```
