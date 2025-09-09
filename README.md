# VCS for LLMs

## Overview
VCS for LLMs is a full-stack application designed to integrate version control systems (VCS) with large language models (LLMs). The project consists of a backend built with FastAPI and a frontend developed using React and Vite. The application provides a seamless interface for managing commits, chats, and authentication, making it a powerful tool for AI-powered development workflows.

## Features
- **Frontend**: A modern React-based UI with TailwindCSS for styling.
- **Backend**: A FastAPI server with MongoDB for data storage.
- **Authentication**: Secure token-based authentication.
- **Chat Integration**: Chat functionality for collaboration.
- **Commit Management**: Tools for managing and viewing commit history.
- **Health Check**: API health monitoring endpoints.

## Project Structure

### Backend
The backend is located in the `backend/` directory and includes the following components:

```
backend/
├── app/
│   ├── api/                # API routes and endpoints
│   │   ├── v1/            # Version 1 of the API
│   │   │   ├── auth.py    # Authentication endpoints
│   │   │   ├── chat.py    # Chat endpoints
│   │   │   ├── commits.py # Commit endpoints
│   │   │   └── api.py     # API router
│   ├── core/               # Core configuration and utilities
│   ├── db/                 # Database connection and models
│   ├── models/             # Pydantic models
│   ├── schemas/            # API schemas
│   ├── services/           # Business logic
│   └── utils/              # Utility functions
├── main.py                 # FastAPI application entry point
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── requirements.txt        # Python dependencies
└── test_api.py             # API tests
```

### Frontend
The frontend is located in the `frontend/` directory and includes the following components:

```
frontend/
├── src/
│   ├── components/         # React components
│   ├── contexts/           # React context for state management
│   ├── services/           # API service layer
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── package.json            # Node.js dependencies
└── tailwind.config.js      # TailwindCSS configuration
```

## Environment Variables

### Backend
The backend uses a `.env` file for configuration. Example:
```env
# Database
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=promptpilot

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend
The frontend uses a `.env` file for configuration. Example:
```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_API_VERSION=v1
```

## Installation

### Prerequisites
- Node.js
- Python 3.9+
- MongoDB
- Docker (optional)

### Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Docker Setup
1. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```

## Usage
- Access the frontend at `http://localhost:5173`.
- The backend API is available at `http://localhost:8000`.

## Testing
- Backend tests:
  ```bash
  pytest
  ```
- Frontend tests:
  ```bash
  npm test
  ```

## Contributing
1. Fork the repository.
2. Create a new branch for your feature:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.


## Acknowledgments
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
