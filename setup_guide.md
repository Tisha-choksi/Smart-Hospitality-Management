# 🏨 Smart Hospitality Management — Initial Setup Guide

> Complete setup instructions for every component of the system.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have these installed:

| Tool | Version | Check Command | Install Link |
|---|---|---|---|
| **Node.js** | v20+ LTS | `node --version` | [nodejs.org](https://nodejs.org) |
| **npm** | v10+ | `npm --version` | Comes with Node.js |
| **Python** | 3.11+ | `python --version` | [python.org](https://python.org) |
| **pip** | Latest | `pip --version` | Comes with Python |
| **Docker Desktop** | Latest | `docker --version` | [docker.com](https://docker.com/products/docker-desktop) |
| **Docker Compose** | v2+ | `docker compose version` | Comes with Docker Desktop |
| **Git** | Latest | `git --version` | [git-scm.com](https://git-scm.com) |
| **VS Code** | Latest | — | [code.visualstudio.com](https://code.visualstudio.com) |

> [!IMPORTANT]
> **Docker Desktop must be running** before starting infrastructure services (PostgreSQL, Redis, ChromaDB, n8n).

---

## 🗂️ Component 1: Project Root & Environment Configuration

### What it does
The root of the project houses Docker Compose files, shared environment variables, and documentation. It orchestrates all services together.

### Setup Steps

```bash
# 1. Navigate to project directory
cd "d:\claude code\Smart Hospitality Management"

# 2. Initialize git repository
git init

# 3. Create the .env.example file (we'll create this with actual values in .env)
# Contains all environment variables for every service
```

### Key Files to Create

**`.env.example`** — Template for all environment variables:
```env
# ============================================
# 🏨 Smart Hospitality Management - Environment Config
# ============================================

# --- General ---
NODE_ENV=development
APP_NAME=SmartHospitality

# --- PostgreSQL ---
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=hospitality_db
POSTGRES_USER=hospitality_admin
POSTGRES_PASSWORD=your_secure_password_here

# --- Redis ---
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password_here

# --- Backend (Express.js) ---
BACKEND_PORT=4000
JWT_SECRET=your_jwt_secret_here_min_32_chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

# --- Frontend (Next.js) ---
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_AI_API_URL=http://localhost:8000/ai
NEXT_PUBLIC_APP_NAME=Smart Hospitality

# --- AI Services (FastAPI) ---
AI_SERVICE_PORT=8000
OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CHROMA_HOST=localhost
CHROMA_PORT=8100

# --- n8n ---
N8N_PORT=5678
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_n8n_password
N8N_WEBHOOK_URL=http://localhost:5678
BACKEND_WEBHOOK_SECRET=your_webhook_secret_here
```

**`.gitignore`** — Keep secrets and build artifacts out of git:
```gitignore
# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
venv/

# Environment
.env
.env.local
.env.production

# Build
.next/
dist/
build/

# IDE
.vscode/
.idea/

# Docker
docker-data/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# n8n
n8n/credentials/

# ChromaDB data
chroma-data/
```

---

## 🐳 Component 2: Docker Compose (Infrastructure Services)

### What it does
Runs PostgreSQL, Redis, ChromaDB, and n8n as containers so you don't need to install them locally. This is the **first thing** you start before any other service.

### Architecture
```
Docker Compose
├── PostgreSQL (port 5432)    → Primary database
├── Redis (port 6379)         → Cache & sessions
├── ChromaDB (port 8100)      → Vector database for RAG
└── n8n (port 5678)           → Workflow automation
```

### Setup Steps

```bash
# 1. Make sure Docker Desktop is running

# 2. Create docker-compose.yml (we'll create this file)

# 3. Start all infrastructure services
docker compose up -d

# 4. Verify all containers are running
docker compose ps

# 5. Check logs if any service fails
docker compose logs postgres
docker compose logs redis
docker compose logs chromadb
docker compose logs n8n
```

### Verifying Each Service

| Service | How to Verify | Expected Result |
|---|---|---|
| **PostgreSQL** | `docker exec -it hospitality-postgres psql -U hospitality_admin -d hospitality_db -c "SELECT 1;"` | Returns `1` |
| **Redis** | `docker exec -it hospitality-redis redis-cli ping` | Returns `PONG` |
| **ChromaDB** | Open `http://localhost:8100/api/v1/heartbeat` in browser | Returns JSON with heartbeat |
| **n8n** | Open `http://localhost:5678` in browser | n8n login page |

### Common Issues & Fixes

| Issue | Fix |
|---|---|
| Port already in use | Change the port mapping in `docker-compose.yml` (e.g., `5433:5432`) |
| Container won't start | Run `docker compose logs <service>` to check errors |
| Data persistence | Data is stored in `./docker-data/` volumes — delete to reset |
| n8n can't reach backend | Use `host.docker.internal` instead of `localhost` on Windows/Mac |

---

## ⚙️ Component 3: Backend (Node.js + Express.js)

### What it does
The REST API server that handles authentication, guest management, bookings, service requests, and acts as a bridge between the frontend and AI services.

### Tech Stack
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **ORM:** Prisma (type-safe database access)
- **Auth:** JSON Web Tokens (JWT) + bcrypt
- **Validation:** Zod
- **Logging:** Winston

### Setup Steps

```bash
# 1. Create backend directory & navigate to it
mkdir backend
cd backend

# 2. Initialize Node.js project
npm init -y

# 3. Install production dependencies
npm install express cors helmet morgan dotenv 
npm install prisma @prisma/client
npm install jsonwebtoken bcryptjs
npm install zod
npm install winston
npm install axios
npm install uuid

# 4. Install development dependencies
npm install -D nodemon jest supertest
npm install -D eslint prettier

# 5. Initialize Prisma
npx prisma init

# 6. Create folder structure
mkdir -p src/config src/middleware src/routes src/controllers src/services src/utils
mkdir -p tests
```

### Folder Structure After Setup
```
backend/
├── prisma/
│   └── schema.prisma          ← Database schema definition
├── src/
│   ├── config/
│   │   ├── database.js        ← Prisma client singleton
│   │   ├── redis.js           ← Redis connection
│   │   └── env.js             ← Environment validation
│   ├── middleware/
│   │   ├── auth.js            ← JWT verification
│   │   ├── errorHandler.js    ← Global error handler
│   │   ├── rateLimiter.js     ← Rate limiting
│   │   └── validate.js        ← Zod validation middleware
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── guest.routes.js
│   │   ├── booking.routes.js
│   │   ├── request.routes.js
│   │   ├── feedback.routes.js
│   │   └── index.js           ← Route aggregator
│   ├── controllers/           ← Request handlers
│   ├── services/              ← Business logic
│   ├── utils/                 ← Helpers
│   └── app.js                 ← Express app setup
├── tests/
├── .env                       ← Local env (from root .env)
├── package.json
├── Dockerfile
└── nodemon.json
```

### Key Configuration Files

**`package.json`** scripts section:
```json
{
  "scripts": {
    "dev": "nodemon src/app.js",
    "start": "node src/app.js",
    "db:migrate": "npx prisma migrate dev",
    "db:seed": "npx prisma db seed",
    "db:studio": "npx prisma studio",
    "test": "jest --coverage",
    "lint": "eslint src/"
  }
}
```

**`nodemon.json`**:
```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["tests/"],
  "exec": "node src/app.js"
}
```

### Running the Backend

```bash
# 1. Copy environment variables
cp ../.env .env    # or create from .env.example

# 2. Run database migrations
npx prisma migrate dev --name init

# 3. Seed initial data (optional)
npx prisma db seed

# 4. Start development server
npm run dev

# Server runs at http://localhost:4000
# Prisma Studio at: npx prisma studio (http://localhost:5555)
```

### Verification

```bash
# Health check
curl http://localhost:4000/api/health
# Expected: { "status": "ok", "timestamp": "..." }
```

---

## 🎨 Component 4: Frontend (Next.js 14)

### What it does
The user interface with three portals: Guest Portal (chat, requests, feedback), Staff Dashboard (task management), and Admin Panel (analytics, knowledge base management).

### Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Vanilla CSS with custom design tokens
- **HTTP Client:** Built-in `fetch` API
- **State:** React Context + `useState`/`useReducer`
- **Icons:** Lucide React

### Setup Steps

```bash
# 1. Navigate to project root
cd "d:\claude code\Smart Hospitality Management"

# 2. Create Next.js app (non-interactive)
npx -y create-next-app@latest frontend --js --app --no-tailwind --eslint --no-src-dir --import-alias "@/*"

# 3. Navigate to frontend
cd frontend

# 4. Install additional dependencies
npm install lucide-react
npm install axios

# 5. Create folder structure
mkdir -p components/ui components/chat components/dashboard components/common
mkdir -p lib
mkdir -p styles/components
mkdir -p app/(guest)/concierge app/(guest)/requests app/(guest)/feedback app/(guest)/explore
mkdir -p app/(staff)/dashboard app/(staff)/requests app/(staff)/coordination
mkdir -p app/(admin)/analytics app/(admin)/knowledge-base app/(admin)/settings
```

### Folder Structure After Setup
```
frontend/
├── app/
│   ├── (guest)/                ← Guest-facing pages
│   │   ├── concierge/          ← AI Chat page
│   │   ├── requests/           ← Service request page
│   │   ├── feedback/           ← Feedback form
│   │   └── explore/            ← Local recommendations
│   ├── (staff)/                ← Staff portal
│   │   ├── dashboard/          ← Overview & alerts
│   │   ├── requests/           ← Manage requests
│   │   └── coordination/       ← Team coordination
│   ├── (admin)/                ← Admin portal
│   │   ├── analytics/          ← Sentiment & ops dashboards
│   │   ├── knowledge-base/     ← Manage RAG docs
│   │   └── settings/           ← System config
│   ├── layout.js               ← Root layout
│   ├── page.js                 ← Landing / login
│   └── globals.css             ← Global styles
├── components/
│   ├── ui/                     ← Design system (Button, Card, Input, etc.)
│   ├── chat/                   ← Chat bubble, chat input, session list
│   ├── dashboard/              ← Metric cards, charts, tables
│   └── common/                 ← Navbar, Sidebar, Footer
├── lib/
│   ├── api.js                  ← API client wrapper
│   ├── auth.js                 ← Auth context & helpers
│   └── utils.js                ← Utility functions
├── styles/
│   ├── design-tokens.css       ← Colors, spacing, typography tokens
│   └── components/             ← Component-specific CSS
├── public/                     ← Static assets (logo, images)
├── next.config.js
└── package.json
```

### Key Configuration

**`next.config.js`**:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API calls to backend in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/api/:path*',
      },
      {
        source: '/ai/:path*',
        destination: 'http://localhost:8000/ai/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Running the Frontend

```bash
cd frontend

# 1. Install dependencies (if not already done)
npm install

# 2. Start development server
npm run dev

# Frontend runs at http://localhost:3000
```

### Verification
- Open `http://localhost:3000` in your browser
- You should see the Next.js default page (we'll replace it with our landing page)

---

## 🤖 Component 5: AI Services (Python + FastAPI)

### What it does
Handles all AI/ML workloads: the RAG pipeline for knowledge retrieval, LangChain agent for the AI concierge, and sentiment analysis for guest feedback.

### Tech Stack
- **Framework:** FastAPI (async Python web framework)
- **LLM Orchestration:** LangChain
- **LLM Provider:** OpenAI (GPT-4o)
- **Vector Store:** ChromaDB (via `chromadb` client)
- **Embeddings:** OpenAI `text-embedding-3-small`
- **Sentiment:** HuggingFace Transformers / VADER
- **HTTP Server:** Uvicorn

### Setup Steps

```bash
# 1. Navigate to project root
cd "d:\claude code\Smart Hospitality Management"

# 2. Create AI services directory
mkdir ai-services
cd ai-services

# 3. Create Python virtual environment
python -m venv .venv

# 4. Activate virtual environment
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# Windows CMD:
# .venv\Scripts\activate.bat

# 5. Install dependencies
pip install fastapi uvicorn[standard] python-dotenv pydantic
pip install langchain langchain-openai langchain-community langchain-chroma
pip install chromadb
pip install openai tiktoken
pip install vaderSentiment
pip install transformers torch  # Optional: for HuggingFace models
pip install httpx               # For async HTTP calls to backend

# 6. Freeze dependencies
pip freeze > requirements.txt

# 7. Create folder structure
mkdir -p app/routers app/services app/models app/prompts app/knowledge_base
mkdir -p tests
```

### Folder Structure After Setup
```
ai-services/
├── .venv/                      ← Python virtual environment (gitignored)
├── app/
│   ├── __init__.py
│   ├── main.py                 ← FastAPI application entry point
│   ├── config.py               ← Environment & settings
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── concierge.py        ← /ai/concierge/* endpoints
│   │   ├── rag.py              ← /ai/rag/* endpoints
│   │   └── sentiment.py        ← /ai/sentiment/* endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── langchain_agent.py  ← LangChain agent with tools
│   │   ├── rag_pipeline.py     ← Document ingestion & retrieval
│   │   ├── embedding_service.py← Embedding generation
│   │   └── sentiment_analyzer.py← Sentiment scoring
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          ← Pydantic request/response models
│   ├── prompts/
│   │   └── concierge_system.txt← System prompt for AI concierge
│   └── knowledge_base/
│       ├── hotel_info.md       ← Hotel details & amenities
│       ├── faq.md              ← Frequently asked questions
│       ├── policies.md         ← Hotel policies
│       ├── dining.md           ← Restaurant menus & timings
│       └── local_guide.md      ← Local attractions & transport
├── tests/
│   ├── test_rag.py
│   └── test_sentiment.py
├── requirements.txt
├── Dockerfile
└── .env                        ← Local environment variables
```

### Key Configuration

**`app/config.py`**:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4o"
    openai_embedding_model: str = "text-embedding-3-small"
    
    # ChromaDB
    chroma_host: str = "localhost"
    chroma_port: int = 8100
    
    # App
    ai_service_port: int = 8000
    debug: bool = True
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Running the AI Services

```bash
cd ai-services

# 1. Activate virtual environment
.venv\Scripts\Activate.ps1

# 2. Set environment variables (or use .env file)
# Ensure OPENAI_API_KEY is set

# 3. Start FastAPI server
uvicorn app.main:app --reload --port 8000

# API runs at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
# ReDoc at http://localhost:8000/redoc
```

### Verification

```bash
# Health check
curl http://localhost:8000/health
# Expected: { "status": "healthy", "service": "ai-services" }

# Interactive API docs
# Open http://localhost:8000/docs in browser
```

---

## 🔄 Component 6: n8n Workflow Automation

### What it does
Handles automated workflows: routing guest requests to staff, coordinating assignments, processing feedback through sentiment analysis, escalating unresolved issues, and dispatching notifications.

### How it works
n8n runs as a Docker container with a web-based visual editor. You design workflows by connecting nodes (triggers, actions, conditions). It communicates with your backend via webhooks and HTTP requests.

### Setup Steps

```bash
# n8n is included in docker-compose.yml and starts automatically
# No separate installation needed!

# 1. Start infrastructure (if not already running)
cd "d:\claude code\Smart Hospitality Management"
docker compose up -d n8n

# 2. Access n8n
# Open http://localhost:5678 in browser
# Login with credentials from .env:
#   User: admin
#   Password: your_n8n_password
```

### Creating Workflows

After logging into n8n at `http://localhost:5678`:

#### Workflow 1: Guest Request Routing
```
1. Click "Add Workflow" → Name it "Guest Request Routing"
2. Add Trigger: Webhook node
   - Method: POST
   - Path: /guest-request
   - This gives you a webhook URL to call from your backend
3. Add Node: HTTP Request → Call AI classification endpoint
   - URL: http://host.docker.internal:8000/ai/classify
   - Method: POST
   - Body: {{ $json.description }}
4. Add Node: IF → Check priority
   - Condition: priority == "urgent"
5. Add Node: HTTP Request → Find available staff
   - URL: http://host.docker.internal:4000/api/staff/available
6. Add Node: HTTP Request → Assign staff
   - URL: http://host.docker.internal:4000/api/requests/{id}/assign
7. Add Node: Send Email → Notify staff member
8. Add Node: Wait → 10 minutes
9. Add Node: IF → Check if acknowledged
10. Add Node: HTTP Request → Escalate if not acknowledged
```

#### Connecting Backend → n8n
Your backend triggers n8n workflows via webhook:
```javascript
// In backend: when a new request is created
const axios = require('axios');

async function triggerN8nWorkflow(requestData) {
  await axios.post(
    'http://localhost:5678/webhook/guest-request',
    requestData,
    { headers: { 'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}` } }
  );
}
```

### Workflow Export/Import
```bash
# Export workflows as JSON for version control
mkdir -p n8n/workflows

# In n8n UI: Workflow → Download → Save to n8n/workflows/
# Each workflow is saved as a .json file
# These can be imported on any n8n instance
```

### Key Webhook Endpoints (after workflow setup)

| Workflow | Webhook URL | Trigger |
|---|---|---|
| Guest Request Routing | `POST /webhook/guest-request` | New service request created |
| Feedback Processor | `POST /webhook/feedback` | New feedback submitted |
| Escalation Handler | `POST /webhook/escalation` | Request not acknowledged |
| Notification Dispatcher | `POST /webhook/notify` | Any notification event |

---

## 🔧 Component 7: CI/CD (GitHub Actions)

### What it does
Automates code quality checks (linting, testing) on every pull request and deploys to staging/production on merges to `main`.

### Setup Steps

```bash
# 1. Create GitHub Actions workflow directory
cd "d:\claude code\Smart Hospitality Management"
mkdir -p .github/workflows
```

### Pipeline Files

**`.github/workflows/ci.yml`** — Runs on every PR:
```yaml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]

jobs:
  lint-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      - run: cd backend && npm ci
      - run: cd backend && npm run lint

  test-backend:
    runs-on: ubuntu-latest
    needs: lint-backend
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd backend && npm ci
      - run: cd backend && npm test
        env:
          DATABASE_URL: postgresql://test_user:test_pass@localhost:5432/test_db

  lint-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: cd ai-services && pip install ruff
      - run: cd ai-services && ruff check .

  test-ai:
    runs-on: ubuntu-latest
    needs: lint-ai
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.11' }
      - run: cd ai-services && pip install -r requirements.txt
      - run: cd ai-services && pytest tests/ -v

  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
```

**`.github/workflows/cd.yml`** — Deploys on merge to main:
```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker images
        run: |
          docker build -t hospitality-backend ./backend
          docker build -t hospitality-ai ./ai-services
          docker build -t hospitality-frontend ./frontend
      
      - name: Deploy to staging
        run: echo "Deploy to staging server"
        # Replace with actual deployment commands
        # e.g., docker push, SSH deploy, or cloud provider CLI
```

---

## 🚀 Complete Startup Sequence

Here is the **exact order** to start everything for local development:

```
Step 1: Start Infrastructure (Docker)
  ↓
Step 2: Run Database Migrations (Backend)
  ↓
Step 3: Start Backend Server (Express)
  ↓
Step 4: Start AI Services (FastAPI)
  ↓
Step 5: Start Frontend (Next.js)
  ↓
Step 6: Configure n8n Workflows (browser)
```

### Quick Start Commands (all from project root)

```bash
# Terminal 1 — Infrastructure
docker compose up -d

# Terminal 2 — Backend
cd backend
npm install
npx prisma migrate dev
npm run dev
# → http://localhost:4000

# Terminal 3 — AI Services
cd ai-services
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# → http://localhost:8000

# Terminal 4 — Frontend
cd frontend
npm install
npm run dev
# → http://localhost:3000

# Browser — n8n
# → http://localhost:5678
```

---

## 🔍 Service Health Check Summary

After all services are running, verify each:

| Service | URL | Expected |
|---|---|---|
| **Frontend** | http://localhost:3000 | Next.js page loads |
| **Backend API** | http://localhost:4000/api/health | `{"status":"ok"}` |
| **AI Services** | http://localhost:8000/docs | Swagger UI loads |
| **PostgreSQL** | `docker exec hospitality-postgres psql -U hospitality_admin -c "SELECT 1;"` | Returns `1` |
| **Redis** | `docker exec hospitality-redis redis-cli ping` | Returns `PONG` |
| **ChromaDB** | http://localhost:8100/api/v1/heartbeat | Heartbeat JSON |
| **n8n** | http://localhost:5678 | Login page |

---

## ⚠️ Troubleshooting Common Issues

| Problem | Solution |
|---|---|
| `EACCES` permission error on npm | Run PowerShell as Administrator or use `nvm` |
| Python venv activation fails | Run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| Docker containers won't start | Ensure Docker Desktop is running; check `docker compose logs` |
| Port already in use | Change ports in `.env` or stop conflicting service |
| Prisma can't connect to DB | Ensure PostgreSQL container is running and DATABASE_URL is correct |
| OpenAI API errors | Verify `OPENAI_API_KEY` is valid and has credits |
| n8n can't reach backend | Use `http://host.docker.internal:4000` instead of `localhost` |
| ChromaDB connection refused | Check container is running: `docker compose ps chromadb` |
| Frontend API calls fail | Check `next.config.js` rewrites match backend port |

---

> [!TIP]
> **Recommended VS Code Extensions:**
> - ESLint, Prettier — JS/TS linting & formatting
> - Prisma — Schema syntax highlighting
> - Python, Pylance — Python support
> - REST Client — Test API endpoints inline
> - Docker — Container management
> - Thunder Client — GUI API testing

> [!NOTE]
> **Next Step:** Once you confirm the setup guide looks good, I'll start creating the actual project files — beginning with Docker Compose, then the backend scaffold, AI services scaffold, and frontend scaffold.
