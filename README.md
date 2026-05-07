# ChatFlow AI

ChatFlow AI is a full-stack AI chat application built with a **React.js frontend** and a **Laravel headless API backend**. It provides an OpenAI-style chat experience with authentication, conversation management, message history, AI responses, and optional real-time streaming support.

The project is organized as a monorepo with separate `frontend`, `backend`, `docs`, `scripts`, and CI/CD workflow directories.

## Features

- User registration, login, and logout
- Protected chat dashboard
- Conversation list and message history
- Send user messages and receive AI assistant replies
- Streaming chat response support
- Laravel API resources and request validation structure
- OpenAI service layer for chat completions and streaming
- Token usage logging support
- Queue jobs for background chat and usage processing
- React SPA architecture with feature-based folders
- Axios API client setup
- Laravel Echo / WebSocket-ready structure
- Backend and frontend test folders
- GitHub Actions workflow structure for CI/CD

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- React Query
- Laravel Echo / WebSocket-ready setup
- CSS modules or global CSS structure

### Backend

- Laravel
- Laravel Sanctum or token-based authentication structure
- REST API controllers
- API resources
- Queues and jobs
- Events and listeners
- OpenAI API integration layer
- Database migrations for users, conversations, messages, and AI usage logs

## Project Structure

```txt
openai-realtime-chat/
├── backend/                 # Laravel headless API
│   ├── app/
│   │   ├── Http/Controllers/Api/V1/
│   │   │   ├── Auth/        # Login, register, logout
│   │   │   └── Chat/        # Conversations, messages, streaming chat
│   │   ├── Models/          # User, Conversation, Message, AiUsageLog
│   │   ├── Services/        # OpenAI, Chat, Auth services
│   │   ├── Actions/         # Business actions
│   │   ├── DTOs/            # Data transfer objects
│   │   ├── Enums/           # Message roles and conversation status
│   │   ├── Jobs/            # Queue jobs
│   │   └── Events/          # Chat and AI streaming events
│   ├── config/
│   ├── database/migrations/
│   ├── routes/
│   ├── tests/
│   └── composer.json
│
├── frontend/                # React.js SPA
│   ├── src/
│   │   ├── app/             # App providers and router
│   │   ├── components/      # Shared UI, layout, feedback components
│   │   ├── features/
│   │   │   ├── auth/        # Auth API, pages, hooks, store
│   │   │   └── chat/        # Chat API, pages, hooks, store, components
│   │   ├── lib/             # Axios, Echo, query client, constants
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── main.jsx
│   ├── public/
│   ├── tests/
│   ├── package.json
│   └── vite.config.js
│
├── docs/                    # API, architecture, deployment docs
├── scripts/                 # Setup and test scripts
├── .github/workflows/       # CI/CD workflows
└── README.md