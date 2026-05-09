# ChatFlow AI

ChatFlow AI is a full-stack AI chat application built with a **React.js frontend** and a **Laravel headless API backend**.

It provides an OpenAI-style chat experience with authentication, chat instance management, message history, AI responses, file uploads, markdown rendering, copy-code support, single-message deletion, full-chat deletion, and a dynamic dashboard.

---

## Table of Contents

- [Features](#features)
- [Public Access Through](#public-access-through)
- [Save File Metadata in Database](#save-file-metadata-in-database)
- [Dashboard](#dashboard)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Project Structure](#project-structure)
- [Backend Setup Laravel](#backend-setup-laravel)
- [Frontend Setup React](#frontend-setup-react)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Storage Setup](#storage-setup)
- [OpenAI / ChatGPT Setup](#openai--chatgpt-setup)
- [API Routes](#api-routes)
- [Frontend Pages and Components](#frontend-pages-and-components)
- [Laravel Controllers](#laravel-controllers)
- [Laravel Helper File](#laravel-helper-file)
- [Useful Commands](#useful-commands)
- [Common Issues](#common-issues)
- [Development Flow](#development-flow)
- [New Developer Checklist](#new-developer-checklist)

---

## Features

### Authentication

- User registration
- User login
- User logout
- Protected API routes
- Token-based authentication using Laravel Sanctum

### Chat

- Create new chat instances
- Dynamic chat instance title generation
- Display chat instance title on `/chat/{id}`
- Chat list in left sidebar
- Active chat highlighting
- Delete full chat instance
- View messages by chat instance
- Send text messages
- Upload files with chat messages
- Download uploaded files
- Send messages to OpenAI / ChatGPT
- Send previous chat history as reference
- Store user and AI messages in database
- Store raw OpenAI response in database
- Display AI responses with markdown formatting
- Display code blocks with copy-code button
- Copy full message text
- Delete single chat message
- Multiline textarea input
- Press `Enter` to send
- Press `Shift + Enter` for a new line

### File Uploads

- Upload files to Laravel local public storage
- Store uploaded files in:

```txt
storage/app/public/chat_uploads/
```

- Public access through:

```txt
/storage/chat_uploads/
```

- Save file metadata in the database:
  - `file_name`
  - `file_path`
  - `file_full_path`
  - `chatgpt_file_id`
  - `chatgpt_file_upload_response`

---

## Public Access Through

Uploaded files are stored in Laravel public storage:

```txt
storage/app/public/chat_uploads/
```

After running:

```bash
php artisan storage:link
```

Laravel creates this public symlink:

```txt
public/storage -> storage/app/public
```

So files become publicly accessible through:

```txt
/storage/chat_uploads/
```

Example file path saved in database:

```txt
storage/chat_uploads/example.pdf
```

Example full download URL:

```txt
http://127.0.0.1:8000/storage/chat_uploads/example.pdf
```

Frontend uses this environment variable to build file download links:

```env
VITE_FILE_BASE_URL=http://127.0.0.1:8000
```

Example frontend generated URL:

```txt
VITE_FILE_BASE_URL + /storage/chat_uploads/example.pdf
```

Final result:

```txt
http://127.0.0.1:8000/storage/chat_uploads/example.pdf
```

---

## Save File Metadata in Database

When a file is uploaded, the backend stores the file locally and saves file metadata in the `chat_messages` table.

Important database columns:

```txt
file_name
file_path
file_full_path
chatgpt_file_id
chatgpt_file_upload_response
ai_raw_response
```

Example database values:

```txt
file_name      = example.pdf
file_path      = storage/chat_uploads/example.pdf
file_full_path = /full/server/path/storage/app/public/chat_uploads/example.pdf
```

If the file is also uploaded to OpenAI, these fields are used:

```txt
chatgpt_file_id               = file-xxxxxxxx
chatgpt_file_upload_response  = 1
ai_raw_response               = Raw OpenAI file upload response JSON
```

Message type for file messages:

```txt
msg_type = 2
```

Message type for normal text messages:

```txt
msg_type = 1
```

---

## Dashboard

The dashboard displays real-time dynamic data from the Laravel API instead of static frontend values.

Dashboard endpoint:

```http
GET /api/dashboard
```

Dashboard data includes:

- Total chats
- Chats today
- Total messages
- Files uploaded
- Daily chats chart
- Chat analysis by category
- Performance overview
- Recent activity

The frontend dashboard file is:

```txt
frontend/src/pages/dashboard/Dashboard.jsx
```

The Laravel dashboard controller is:

```txt
backend/laravel/app/Http/Controllers/Api/Dashboard/DashboardStats.php
```

Example dashboard route:

```php
use App\Http\Controllers\Api\Dashboard\DashboardStats;

Route::middleware('auth:sanctum')->get('/dashboard', DashboardStats::class);
```

---

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Bootstrap
- Font Awesome
- React Markdown
- Remark GFM
- Global CSS files

Required frontend packages:

```bash
npm install
npm install axios
npm install react-router-dom
npm install react-markdown remark-gfm
npm install bootstrap
```

Optional Font Awesome package:

```bash
npm install @fortawesome/fontawesome-free
```

Example imports in `main.jsx`:

```js
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
```

### Backend

- Laravel
- Laravel Sanctum
- REST API controllers
- Eloquent ORM
- Laravel migrations
- Laravel storage
- OpenAI Responses API
- cURL-based OpenAI helper functions
- JSON API responses

---

## Requirements

### Backend Requirements

- PHP 8.1 or higher
- Composer
- MySQL or MariaDB
- Laravel compatible server
- PHP extensions:
  - `curl`
  - `fileinfo`
  - `mbstring`
  - `openssl`
  - `pdo`
  - `tokenizer`
  - `xml`

Check backend versions:

```bash
php -v
composer -V
```

### Frontend Requirements

- Node.js 18 or higher
- npm

Check frontend versions:

```bash
node -v
npm -v
```

---

## Project Structure

```txt
ChatFlow-AI/
├── backend/
│   └── laravel/
│       ├── app/
│       │   ├── Helpers/
│       │   │   └── ChatHelper.php
│       │   ├── Http/
│       │   │   └── Controllers/
│       │   │       └── Api/
│       │   │           ├── Auth/
│       │   │           ├── Chat/
│       │   │           │   ├── SendMessage.php
│       │   │           │   ├── GetMessages.php
│       │   │           │   ├── ChatList.php
│       │   │           │   ├── DeleteMessage.php
│       │   │           │   └── DeleteChatInstance.php
│       │   │           └── Dashboard/
│       │   │               └── DashboardStats.php
│       │   └── Models/
│       │       └── ChatMessage.php
│       ├── config/
│       ├── database/
│       │   └── migrations/
│       ├── routes/
│       │   └── api.php
│       ├── storage/
│       │   └── app/public/chat_uploads/
│       ├── composer.json
│       └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── css/
│   │   │       ├── chat.css
│   │   │       └── dashboard.css
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── LeftNavbar.jsx
│   │   ├── pages/
│   │   │   ├── chat/
│   │   │   │   └── Chat.jsx
│   │   │   └── dashboard/
│   │   │       └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

## Backend Setup Laravel

Go to the Laravel backend folder:

```bash
cd backend/laravel
```

Install PHP dependencies:

```bash
composer install
```

Copy environment file:

```bash
cp .env.example .env
```

Generate Laravel app key:

```bash
php artisan key:generate
```

Configure database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chatflow_ai
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

Create storage symlink:

```bash
php artisan storage:link
```

Clear Laravel cache:

```bash
php artisan optimize:clear
```

Run Laravel backend:

```bash
php artisan serve
```

Default backend URL:

```txt
http://127.0.0.1:8000
```

---

## Frontend Setup React

Go to the frontend folder:

```bash
cd frontend
```

Install npm dependencies:

```bash
npm install
```

Install required frontend packages:

```bash
npm install axios
npm install react-router-dom
npm install react-markdown remark-gfm
npm install bootstrap
```

Optional Font Awesome package:

```bash
npm install @fortawesome/fontawesome-free
```

Run frontend:

```bash
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

---

## Environment Variables

## Frontend `.env`

Create or update:

```txt
frontend/.env
```

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_FILE_BASE_URL=http://127.0.0.1:8000
```

### Frontend Environment Explanation

`VITE_API_BASE_URL` is used for Laravel API calls.

Example:

```txt
http://127.0.0.1:8000/api/chat/send
```

`VITE_FILE_BASE_URL` is used for uploaded file download URLs.

Example:

```txt
http://127.0.0.1:8000/storage/chat_uploads/file-name.pdf
```

After changing frontend `.env`, restart Vite:

```bash
npm run dev
```

---

## Backend `.env`

Create or update:

```txt
backend/laravel/.env
```

Basic Laravel config:

```env
APP_NAME="ChatFlow AI"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

LOG_CHANNEL=stack
LOG_LEVEL=debug
```

Database config:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=chatflow_ai
DB_USERNAME=root
DB_PASSWORD=
```

Sanctum / session config example:

```env
SESSION_DRIVER=file
SESSION_LIFETIME=120
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

OpenAI config:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini

OPENAI_TITLE_MODEL=gpt-4.1-mini
CHATGPT_TITLE_TEMPERATURE=0.2
CHATGPT_TITLE_MAX_TOKENS=20

CHATGPT_ROLE=system
CHATGPT_ROLE_CONTENT="You are a helpful assistant."
CHATGPT_TEMPERATURE=0.2

CHATGPT_HISTORY_LIMIT=15
CHATGPT_SEND_MSG_FOR_REFERENCE=0

CHATGPT_TOOL_TYPE=web_search
CHATGPT_SEARCH_CONTEXT_SIZE=medium
CHATGPT_CURL_TIMEOUT=120
```

After changing Laravel `.env`, run:

```bash
php artisan optimize:clear
```

---

## Database Setup

The main table used for chat messages is:

```txt
chat_messages
```

Expected columns:

```txt
id
user_id
chat_owner
ai_instance_id
instance_title
msg
msg_type
file_name
file_path
file_full_path
chatgpt_file_id
ai_raw_response
chatgpt_file_upload_response
added_at
```

### Message Types

```txt
msg_type = 1  text message
msg_type = 2  file message
```

### Chat Owner

```txt
chat_owner = 1  user
chat_owner = 2  AI bot
```

Example migration:

```php
Schema::create('chat_messages', function (Blueprint $table) {
    $table->bigIncrements('id');

    $table->unsignedBigInteger('user_id');

    $table->tinyInteger('chat_owner')
        ->comment('1=user,2=ai_bot');

    $table->unsignedBigInteger('ai_instance_id');

    $table->text('instance_title')->nullable();

    $table->text('msg');

    $table->tinyInteger('msg_type')
        ->default(1)
        ->comment('1=text,2=file');

    $table->text('file_name')->nullable();
    $table->text('file_path')->nullable();
    $table->text('file_full_path')->nullable();

    $table->text('chatgpt_file_id')->nullable();

    $table->longText('ai_raw_response')->nullable();

    $table->tinyInteger('chatgpt_file_upload_response')
        ->default(0);

    $table->timestamp('added_at')->useCurrent();

    $table->index('user_id');
    $table->index('ai_instance_id');
    $table->index('chat_owner');
    $table->index('msg_type');
});
```

Run migrations:

```bash
php artisan migrate
```

---

## Storage Setup

Uploaded files are saved locally in Laravel public storage.

Storage path:

```txt
storage/app/public/chat_uploads/
```

Public path:

```txt
/storage/chat_uploads/
```

Run this once:

```bash
php artisan storage:link
```

This creates a public symlink:

```txt
public/storage -> storage/app/public
```

Example stored DB values:

```txt
file_full_path = /full/server/path/storage/app/public/chat_uploads/file-name.pdf
file_path      = storage/chat_uploads/file-name.pdf
file_name      = file-name.pdf
```

Example download URL:

```txt
http://127.0.0.1:8000/storage/chat_uploads/file-name.pdf
```

---

## OpenAI / ChatGPT Setup

The app uses helper functions inside:

```txt
app/Helpers/ChatHelper.php
```

Main responsibilities:

- Upload local files to OpenAI
- Send messages to OpenAI Responses API
- Attach previous chat history
- Attach uploaded file IDs to chat history
- Extract AI response text
- Save raw OpenAI response
- Generate short chat instance titles
- Handle title fallback if OpenAI fails

Required `.env` values:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_TITLE_MODEL=gpt-4.1-mini

CHATGPT_ROLE=system
CHATGPT_ROLE_CONTENT="You are a helpful assistant."
CHATGPT_TEMPERATURE=0.2

CHATGPT_HISTORY_LIMIT=15
CHATGPT_SEND_MSG_FOR_REFERENCE=0

CHATGPT_TOOL_TYPE=web_search
CHATGPT_SEARCH_CONTEXT_SIZE=medium
CHATGPT_CURL_TIMEOUT=120

CHATGPT_TITLE_TEMPERATURE=0.2
CHATGPT_TITLE_MAX_TOKENS=20
```

### Important OpenAI Notes

`CHATGPT_CURL_TIMEOUT` is in seconds.

Recommended:

```env
CHATGPT_CURL_TIMEOUT=120
```

`CHATGPT_HISTORY_LIMIT` controls how many previous messages are loaded from the database.

```env
CHATGPT_HISTORY_LIMIT=15
```

`CHATGPT_SEND_MSG_FOR_REFERENCE=0` means send all loaded history.

If you set:

```env
CHATGPT_SEND_MSG_FOR_REFERENCE=-10
```

it sends only the last 10 loaded history items.

---

## API Routes

Add routes in:

```txt
routes/api.php
```

Example:

```php
use App\Http\Controllers\Api\Chat\SendMessage;
use App\Http\Controllers\Api\Chat\ChatList;
use App\Http\Controllers\Api\Chat\GetMessages;
use App\Http\Controllers\Api\Chat\DeleteMessage;
use App\Http\Controllers\Api\Chat\DeleteChatInstance;
use App\Http\Controllers\Api\Dashboard\DashboardStats;

Route::middleware('auth:sanctum')->prefix('chat')->group(function () {
    Route::post('/send', SendMessage::class);
    Route::get('/list', ChatList::class);
    Route::get('/{aiInstanceId}/messages', GetMessages::class);
    Route::delete('/messages/{messageId}', DeleteMessage::class);
    Route::delete('/instances/{aiInstanceId}', DeleteChatInstance::class);
});

Route::middleware('auth:sanctum')->get('/dashboard', DashboardStats::class);
```

### API Endpoints

### Send Message

```http
POST /api/chat/send
```

Form data:

```txt
msg
msg_type
ai_instance_id optional
file optional
```

### Chat List

```http
GET /api/chat/list
```

### Get Chat Messages

```http
GET /api/chat/{aiInstanceId}/messages
```

Expected response includes:

```json
{
  "status": true,
  "message": "Chat messages fetched successfully.",
  "data": {
    "ai_instance_id": 1,
    "instance_title": "Example Chat Title",
    "messages": []
  },
  "errors": null
}
```

### Delete Single Message

```http
DELETE /api/chat/messages/{messageId}
```

### Delete Full Chat Instance

```http
DELETE /api/chat/instances/{aiInstanceId}
```

### Dashboard

```http
GET /api/dashboard
```

---

## Frontend Pages and Components

### Chat Page

File:

```txt
frontend/src/pages/chat/Chat.jsx
```

Features:

- Fetch chat messages by instance ID
- Display chat instance title at the top
- Send text and file messages
- Markdown rendering
- Code block copy button
- Copy full message
- Delete single message
- File download UI
- Multiline textarea input
- `Enter` to send
- `Shift + Enter` for new line

### Sidebar

File:

```txt
frontend/src/components/LeftNavbar.jsx
```

Features:

- Shows menu links
- Shows chat instances
- Highlights active chat
- Deletes chat instance
- Redirects to `/chat` if the current chat is deleted

### Dashboard

File:

```txt
frontend/src/pages/dashboard/Dashboard.jsx
```

Features:

- Fetches dynamic dashboard data from Laravel
- Shows total chats
- Shows chats today
- Shows total messages
- Shows files uploaded
- Shows daily chat chart
- Shows recent activity

### Axios API Service

File:

```txt
frontend/src/services/api.js
```

Example setup:

```js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

---

## Laravel Controllers

Recommended controller files:

```txt
app/Http/Controllers/Api/Chat/SendMessage.php
app/Http/Controllers/Api/Chat/GetMessages.php
app/Http/Controllers/Api/Chat/ChatList.php
app/Http/Controllers/Api/Chat/DeleteMessage.php
app/Http/Controllers/Api/Chat/DeleteChatInstance.php
app/Http/Controllers/Api/Dashboard/DashboardStats.php
```

Create controllers with:

```bash
php artisan make:controller Api/Chat/SendMessage --invokable
php artisan make:controller Api/Chat/GetMessages --invokable
php artisan make:controller Api/Chat/ChatList --invokable
php artisan make:controller Api/Chat/DeleteMessage --invokable
php artisan make:controller Api/Chat/DeleteChatInstance --invokable
php artisan make:controller Api/Dashboard/DashboardStats --invokable
```

---

## Laravel Helper File

Create:

```txt
app/Helpers/ChatHelper.php
```

Register helper in `composer.json`:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/"
    },
    "files": [
        "app/Helpers/ChatHelper.php"
    ]
}
```

Then run:

```bash
composer dump-autoload
```

The helper file should include functions like:

```txt
ai_chat_file_upload_laravel
get_chat_instance_id_laravel
create_chat_instance_title_laravel
chatgpt_generate_instance_title
get_chatgpt_api_key
get_the_previous_chat_history
chatgpt_upload_file
extract_chatgpt_reply_text
chatgpt_send_msg
get_the_ai_cleaned_response
```

---

## Required Frontend Packages

Install these in the frontend folder:

```bash
npm install
npm install axios
npm install react-router-dom
npm install react-markdown remark-gfm
npm install bootstrap
```

If Font Awesome is installed through npm:

```bash
npm install @fortawesome/fontawesome-free
```

Or include Font Awesome CDN in your HTML.

Example import in `main.jsx`:

```js
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
```

---

## Useful Commands

### Backend

Run Laravel:

```bash
php artisan serve
```

Run migrations:

```bash
php artisan migrate
```

Fresh migrate:

```bash
php artisan migrate:fresh
```

Create storage symlink:

```bash
php artisan storage:link
```

Clear cache:

```bash
php artisan optimize:clear
```

Clear routes:

```bash
php artisan route:clear
```

List routes:

```bash
php artisan route:list
```

Search chat routes:

```bash
php artisan route:list | grep chat
```

Refresh helper autoload:

```bash
composer dump-autoload
```

### Frontend

Run React:

```bash
npm run dev
```

Build React:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Common Issues

### 1. React cannot find `react-markdown`

Error:

```txt
Failed to resolve import "react-markdown"
```

Fix:

```bash
npm install react-markdown remark-gfm
npm run dev
```

---

### 2. File download URL is wrong

Make sure frontend `.env` has:

```env
VITE_FILE_BASE_URL=http://127.0.0.1:8000
```

Make sure Laravel storage link exists:

```bash
php artisan storage:link
```

---

### 3. API route not found

Example error:

```txt
The route api/chat/messages/1 could not be found.
```

Check route exists:

```bash
php artisan route:list | grep chat
```

Clear route cache:

```bash
php artisan route:clear
php artisan optimize:clear
```

Make sure route in `routes/api.php` does not include `/api` manually.

Correct:

```php
Route::delete('/chat/messages/{messageId}', DeleteMessage::class);
```

Wrong:

```php
Route::delete('/api/chat/messages/{messageId}', DeleteMessage::class);
```

---

### 4. Uploaded files are not accessible

Run:

```bash
php artisan storage:link
```

Check file exists in:

```txt
storage/app/public/chat_uploads/
```

Check browser URL:

```txt
http://127.0.0.1:8000/storage/chat_uploads/file-name.pdf
```

---

### 5. OpenAI response is saved in `ai_raw_response` but not in `msg`

This usually means the response extractor is reading the wrong output item.

Use an extraction function that checks:

```txt
output_text
output[*].type = message
output[*].content[*].text
```

because sometimes:

```txt
output[0] = web_search_call
output[1] = message
```

---

### 6. Previous chat history is not being sent

Check:

```env
CHATGPT_HISTORY_LIMIT=15
CHATGPT_SEND_MSG_FOR_REFERENCE=0
```

Also make sure `get_the_previous_chat_history()` loads messages by:

```txt
user_id
ai_instance_id
```

and sorts them back in ascending order before sending to OpenAI.

---

### 7. `.env` changes not working

After backend `.env` changes:

```bash
php artisan optimize:clear
```

After frontend `.env` changes:

```bash
npm run dev
```

Vite must be restarted after changing `.env`.

---

## Development Flow

Start backend:

```bash
cd backend/laravel
php artisan serve
```

Start frontend:

```bash
cd frontend
npm run dev
```

Open frontend:

```txt
http://localhost:5173
```

Backend API:

```txt
http://127.0.0.1:8000/api
```

File base URL:

```txt
http://127.0.0.1:8000
```

---

## New Developer Checklist

Before running the app, confirm:

- MySQL database exists
- Laravel `.env` is configured
- OpenAI API key is set
- Migrations have been run
- Storage symlink exists
- Frontend `.env` points to Laravel API
- Frontend packages are installed
- Backend server is running
- Frontend dev server is running

Minimum backend command checklist:

```bash
cd backend/laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan optimize:clear
php artisan serve
```

Minimum frontend command checklist:

```bash
cd frontend
npm install
npm install react-markdown remark-gfm axios react-router-dom bootstrap
npm run dev
```

---

## Final Notes

- Make sure Laravel backend is running before using the React frontend.
- Make sure `VITE_API_BASE_URL` points to the Laravel API URL.
- Make sure `VITE_FILE_BASE_URL` points to the Laravel public base URL.
- Make sure `php artisan storage:link` has been run for file downloads.
- Make sure `OPENAI_API_KEY` is set in Laravel `.env`.
- For authenticated API routes, the frontend must send the user token with Axios.