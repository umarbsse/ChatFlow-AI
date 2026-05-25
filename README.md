# ChatFlow AI

ChatFlow AI is a full-stack AI chat application with a Laravel API backend and a React/Vite frontend.

The backend lives in `backend/laravel` and exposes a Sanctum-protected JSON API. The frontend lives in `frontend/react` and provides the chat UI, dashboard, account screens, and OpenAI configuration screen.

## Features

- User registration and login with Laravel Sanctum bearer tokens.
- Protected account pages for profile updates, password changes, and logout.
- Chat instances with message history, generated titles, and active chat navigation.
- Text chat with OpenAI responses.
- File upload support for chat messages.
- Markdown rendering for AI replies, including code block rendering and copy actions.
- Single-message deletion and full chat-instance deletion.
- Dashboard statistics for chats, messages, uploaded files, recent activity, and weekly usage.
- OpenAI configuration screen backed by Laravel `.env` updates.

## Tech Stack

Backend:

- PHP 8.2+
- Laravel 12
- Laravel Sanctum
- Eloquent ORM and migrations
- Custom OpenAI services under `app/Services/OpenAI`
- Local Laravel storage for uploaded chat files

Frontend:

- React 19
- Vite 8
- React Router 7
- Axios
- Bootstrap 5
- Font Awesome
- React Markdown
- Remark GFM

## Repository Layout

```txt
ChatFlow-AI/
|-- backend/
|   `-- laravel/        Laravel API application
|-- frontend/
|   `-- react/          React/Vite single page app
|-- README.md
`-- dir.structure.txt
```

For a fuller tree, see `dir.structure.txt`.

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- MySQL/MariaDB or SQLite
- OpenAI API key

## Backend Setup

From the repository root:

```bash
cd backend/laravel
composer install
```

Create the backend environment file:

```powershell
Copy-Item .env.example .env
```

Generate the Laravel key:

```bash
php artisan key:generate
```

Configure the database in `backend/laravel/.env`.

SQLite example:

```env
DB_CONNECTION=sqlite
```

MySQL example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chatflow_ai
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations and create the public storage link:

```bash
php artisan migrate
php artisan storage:link
```

Start the API server:

```bash
php artisan serve
```

Default backend URLs:

```txt
Backend: http://127.0.0.1:8000
API:     http://127.0.0.1:8000/api
Files:   http://127.0.0.1:8000/storage/chat_uploads/{file-name}
```

## Frontend Setup

From the repository root:

```bash
cd frontend/react
npm install
```

Create or update `frontend/react/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_FILE_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

## OpenAI Configuration

The backend reads OpenAI settings from `backend/laravel/.env`. These values can also be edited from the protected frontend page at `/config/openai`.

Supported OpenAI config keys:

```env
OPENAI_API_KEY=
OPENAI_MODEL=
OPENAI_TITLE_MODEL=
CHATGPT_ROLE=system
CHATGPT_ROLE_CONTENT="You are a helpful assistant."
CHATGPT_TEMPERATURE=0.2
CHATGPT_TITLE_TEMPERATURE=0.2
CHATGPT_TITLE_MAX_TOKENS=20
CHATGPT_HISTORY_LIMIT=15
CHATGPT_SEND_MSG_FOR_REFERENCE=0
CHATGPT_TOOL_TYPE=web_search
CHATGPT_SEARCH_CONTEXT_SIZE=medium
CHATGPT_CURL_TIMEOUT=120
OPENAI_FILE_PURPOSE=assistants
```

After manual backend `.env` changes, clear cached config:

```bash
php artisan optimize:clear
```

After frontend `.env` changes, restart Vite.

## API Routes

Public routes:

```http
POST /api/user/register
POST /api/user/login
```

Protected routes require:

```http
Authorization: Bearer {token}
Accept: application/json
```

Protected user routes:

```http
GET  /api/user/profile
PUT  /api/user/profile
POST /api/user/change-password
```

Protected chat routes:

```http
POST   /api/chat/send
GET    /api/chat/list
GET    /api/chat/{aiInstanceId}/messages
DELETE /api/chat/messages/{messageId}
DELETE /api/chat/instances/{aiInstanceId}
```

Protected dashboard and config routes:

```http
GET /api/dashboard
GET /api/config/openai
PUT /api/config/openai
```

## Chat Requests

`POST /api/chat/send` accepts multipart form data:

```txt
msg             optional text message
msg_type        optional, 1 for text or 2 for file
ai_instance_id  optional existing chat instance id
instance_title  optional chat title
file            optional uploaded file
```

At least one of `msg` or `file` is required.

## Storage

Uploaded chat files are stored by Laravel at:

```txt
backend/laravel/storage/app/public/chat_uploads/
```

After running `php artisan storage:link`, they are publicly served from:

```txt
/storage/chat_uploads/
```

The frontend builds download links by combining `VITE_FILE_BASE_URL` with the stored file path.

## Important Backend Files

- `backend/laravel/routes/api.php` defines all API routes.
- `backend/laravel/app/Http/Controllers/Api` contains invokable API controllers.
- `backend/laravel/app/Actions` contains application use cases.
- `backend/laravel/app/Services/Chat` contains chat-specific services.
- `backend/laravel/app/Services/OpenAI` contains OpenAI client, file, chat, and response parsing services.
- `backend/laravel/app/Services/Config/OpenAIEnvConfigService.php` reads and writes OpenAI `.env` settings.
- `backend/laravel/app/Models/ChatMessage.php` maps the chat message table.
- `backend/laravel/database/migrations/2026_05_08_192321_create_chat_messages_table.php` creates the chat message schema.

## Important Frontend Files

- `frontend/react/src/App.jsx` defines public and protected routes.
- `frontend/react/src/services/api.js` configures Axios and attaches the stored bearer token.
- `frontend/react/src/layouts/AppLayout.jsx` wraps protected app pages with the sidebar and header.
- `frontend/react/src/components/ProtectedRoute.jsx` redirects unauthenticated users to login.
- `frontend/react/src/pages/chat` contains the chat screen, hook, components, and utilities.
- `frontend/react/src/pages/dashboard` contains the dashboard screen, data hook, and widgets.
- `frontend/react/src/pages/account` contains login, register, settings, password, forgot-password, and logout screens.
- `frontend/react/src/pages/config/openai-config` contains the OpenAI configuration UI.

## Useful Commands

Backend:

```bash
cd backend/laravel
php artisan serve
php artisan migrate
php artisan route:list
php artisan optimize:clear
php artisan test
```

Frontend:

```bash
cd frontend/react
npm run dev
npm run build
npm run lint
npm run preview
```

## Development Notes

- Do not commit `.env`, `vendor`, `node_modules`, runtime caches, or uploaded private files.
- The frontend stores auth data in `localStorage` using `auth_token`, `auth_user`, and `token_type`.
- The Axios client sends the bearer token automatically when `auth_token` is present.
- Laravel stores chat rows in the `chat_messages` table.
- Message owner values are `1` for user messages and `2` for AI messages.
- Message type values are `1` for text and `2` for files.
