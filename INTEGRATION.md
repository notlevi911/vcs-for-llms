# PromptPilot Full Stack Integration

Complete integration guide for running PromptPilot with both frontend and backend.

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
python run.py
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 📋 Prerequisites

### Backend Requirements
- Python 3.8+
- MongoDB running on localhost:27017
- Ollama with Llama3 model

### Frontend Requirements
- Node.js 16+
- npm or yarn

## 🔧 Setup Instructions

### Backend Setup
1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp env_example.txt .env
   # Edit .env with your settings
   ```

3. **Start MongoDB**:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

4. **Install and start Ollama**:
   ```bash
   # Install Ollama
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Pull Llama3 model
   ollama pull llama3
   
   # Start Ollama server
   ollama serve
   ```

5. **Run backend**:
   ```bash
   python run.py
   ```

### Frontend Setup
1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

## 🎯 Features

### Authentication
- **Landing Page**: Beautiful login/register forms
- **JWT Authentication**: Secure token-based auth
- **User Management**: Register, login, logout

### Chat System
- **Real AI Responses**: Powered by Ollama + LangChain
- **Message History**: Persistent conversation storage
- **Modern UI**: ChatGPT-like interface

### Commit System
- **Save Conversations**: Git-like commit functionality
- **Restore History**: Fetch previous conversation states
- **Linear History**: Clean commit timeline

## 🔗 API Integration

The frontend connects to backend via REST API:

- `POST /v1/auth/login` - User login
- `POST /v1/auth/register` - User registration
- `POST /v1/chat` - Send message to AI
- `POST /v1/commits/commit` - Save chat state
- `POST /v1/commits/fetch/{commitId}` - Restore chat
- `GET /v1/commits/{chatId}` - Get commit history

## 🧪 Testing

### Test Backend
```bash
cd backend
python test_api.py
```

### Test Frontend
1. Open http://localhost:5173
2. Register a new account
3. Send a message to test AI integration
4. Create a commit
5. Fetch the commit to restore state

## 🐛 Troubleshooting

### Backend Issues
- **"Cannot connect to Ollama"**: Ensure Ollama is running with `ollama serve`
- **"Cannot connect to MongoDB"**: Start MongoDB with Docker or locally
- **"Import errors"**: Install dependencies with `pip install -r requirements.txt`

### Frontend Issues
- **"Backend not accessible"**: Check console for health check status
- **"CORS errors"**: Ensure backend CORS is configured for frontend URL
- **"Authentication fails"**: Check backend is running and accessible

### Integration Issues
- **API calls fail**: Verify backend is running on port 8000
- **Messages not saving**: Check MongoDB connection
- **AI responses slow**: Ollama model might be loading

## 📊 Architecture

```
Frontend (React + Tailwind)
    ↓ HTTP/REST API
Backend (FastAPI + LangChain)
    ↓ Database
MongoDB (Users, Chats, Commits)
    ↓ AI Processing
Ollama (Llama3 Model)
```

## 🚀 Production Deployment

### Backend
```bash
# Using Docker
cd backend
docker-compose up -d
```

### Frontend
```bash
# Build for production
cd frontend
npm run build

# Serve with nginx or similar
```

## 📝 Development Notes

- Backend uses FastAPI with proper project structure
- Frontend uses React with TypeScript and Tailwind CSS
- Authentication is JWT-based with secure token storage
- All API calls include proper error handling
- Real-time chat with AI using LangChain + Ollama
- Git-like commit system for conversation management

## 🎉 Success Indicators

✅ Backend starts without errors  
✅ Frontend loads landing page  
✅ User can register/login  
✅ Chat messages get AI responses  
✅ Commits can be created and fetched  
✅ All API endpoints respond correctly  

The integration is complete when all features work end-to-end!
