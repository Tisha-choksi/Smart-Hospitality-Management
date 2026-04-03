# 🏨 Phase 1: Foundation & Setup — Complete Coding Guide

> **Timeline:** Week 1–2 | **Goal:** Scaffold the entire monorepo, spin up infrastructure, and get all 3 services (backend, frontend, AI) running with health checks, auth, and database schema.

---

## 📋 Master Checklist

Track your progress through every Phase 1 task. Each checkbox represents a concrete deliverable.

### Task 1.1 — Project Scaffolding
- [ ] Create root project directory structure
- [ ] Initialize Git repository
- [ ] Create `.gitignore`
- [ ] Create `README.md` with project overview
- [ ] Create `docs/` directory with `architecture.md`
- [ ] Create `.env.example` with all environment variables
- [ ] Copy `.env.example` → `.env` with local dev values

### Task 1.2 — Docker Compose Setup
- [ ] Create `docker-compose.yml` (PostgreSQL, Redis, ChromaDB, n8n)
- [ ] Create `docker-compose.dev.yml` (dev overrides)
- [ ] Create `docker-data/` directory (for volume persistence)
- [ ] Start Docker Desktop
- [ ] Run `docker compose up -d`
- [ ] Verify PostgreSQL is running (port 5432)
- [ ] Verify Redis is running (port 6379)
- [ ] Verify ChromaDB is running (port 8100)
- [ ] Verify n8n is running (port 5678)

### Task 1.3 — Frontend Init (Next.js 14)
- [ ] Create Next.js 14 app with App Router
- [ ] Set up folder structure (guest/staff/admin routes)
- [ ] Create CSS design system (`design-tokens.css`)
- [ ] Create `globals.css` with base styles
- [ ] Create root `layout.js` with fonts & metadata
- [ ] Create landing page (`page.js`)
- [ ] Configure `next.config.js` with API rewrites
- [ ] Install dependencies (lucide-react, axios)
- [ ] Verify `npm run dev` → http://localhost:3000

### Task 1.4 — Backend Init (Express.js)
- [ ] Initialize Node.js project
- [ ] Install all production dependencies
- [ ] Install dev dependencies (nodemon, jest, eslint)
- [ ] Create `src/app.js` with Express setup
- [ ] Create `src/config/env.js` (env validation)
- [ ] Create `src/config/database.js` (Prisma client)
- [ ] Create `src/config/redis.js` (Redis connection)
- [ ] Create `src/middleware/errorHandler.js`
- [ ] Create `src/middleware/rateLimiter.js`
- [ ] Create `src/routes/index.js` with health check
- [ ] Create `src/utils/logger.js` (Winston)
- [ ] Create `nodemon.json`
- [ ] Create `Dockerfile`
- [ ] Verify `npm run dev` → http://localhost:4000/api/health

### Task 1.5 — Database Schema (Prisma)
- [ ] Initialize Prisma (`npx prisma init`)
- [ ] Define all models in `schema.prisma` (Guest, Booking, Room, Staff, ServiceRequest, ChatSession, ChatMessage, Feedback, SentimentResult, KnowledgeDoc, EmbeddingChunk, Escalation, Task)
- [ ] Configure PostgreSQL connection string
- [ ] Run initial migration (`npx prisma migrate dev --name init`)
- [ ] Create seed script (`prisma/seed.js`)
- [ ] Run seed data (`npx prisma db seed`)
- [ ] Verify with Prisma Studio (`npx prisma studio`)

### Task 1.6 — AI Services Init (FastAPI)
- [ ] Create `ai-services/` directory
- [ ] Create Python virtual environment
- [ ] Install all Python dependencies
- [ ] Create `requirements.txt`
- [ ] Create `app/main.py` (FastAPI entry)
- [ ] Create `app/config.py` (settings)
- [ ] Create router stubs (`concierge.py`, `rag.py`, `sentiment.py`)
- [ ] Create `app/models/schemas.py` (Pydantic models)
- [ ] Create `Dockerfile`
- [ ] Verify `uvicorn` → http://localhost:8000/docs

### Task 1.7 — Auth System (JWT + Roles)
- [ ] Create `src/middleware/auth.js` (JWT verification)
- [ ] Create `src/middleware/authorize.js` (role-based access)
- [ ] Create `src/routes/auth.routes.js`
- [ ] Create `src/controllers/auth.controller.js`
- [ ] Create `src/services/auth.service.js`
- [ ] Implement `POST /api/auth/register`
- [ ] Implement `POST /api/auth/login`
- [ ] Implement `GET /api/auth/me` (current user)
- [ ] Test auth flow with curl/Thunder Client

### Task 1.8 — Environment Config
- [ ] Finalize `.env.example` with all variables
- [ ] Add config validation (fail-fast on missing vars)
- [ ] Create `backend/.env` (symlink or copy from root)
- [ ] Create `ai-services/.env`
- [ ] Create `frontend/.env.local`
- [ ] Document all variables in `docs/environment.md`

---

## 📁 Phase 1 File Structure

After completing Phase 1, your project will look exactly like this:

```
Smart Hospitality Management/
│
├── 📄 .gitignore
├── 📄 .env.example
├── 📄 .env                          ← Local dev (git-ignored)
├── 📄 README.md
├── 📄 docker-compose.yml            ← Infrastructure services
├── 📄 docker-compose.dev.yml        ← Dev overrides
│
├── 📂 .github/
│   └── 📂 workflows/
│       └── 📄 ci.yml                ← Lint + test pipeline (stub)
│
├── 📂 docs/
│   ├── 📄 architecture.md
│   ├── 📄 environment.md
│   └── 📄 setup-guide.md
│
├── 📂 docker-data/                   ← Persistent volumes (git-ignored)
│   ├── 📂 postgres/
│   ├── 📂 redis/
│   ├── 📂 chromadb/
│   └── 📂 n8n/
│
├── 📂 backend/                       ← Node.js + Express API
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 nodemon.json
│   ├── 📄 Dockerfile
│   ├── 📄 .env                      ← Backend env (git-ignored)
│   ├── 📂 prisma/
│   │   ├── 📄 schema.prisma         ← Full database schema
│   │   ├── 📄 seed.js               ← Sample data seeder
│   │   └── 📂 migrations/           ← Auto-generated by Prisma
│   ├── 📂 src/
│   │   ├── 📄 app.js                ← Express app entry point
│   │   ├── 📂 config/
│   │   │   ├── 📄 env.js            ← Environment validation
│   │   │   ├── 📄 database.js       ← Prisma client singleton
│   │   │   └── 📄 redis.js          ← Redis connection
│   │   ├── 📂 middleware/
│   │   │   ├── 📄 auth.js           ← JWT verification
│   │   │   ├── 📄 authorize.js      ← Role-based access control
│   │   │   ├── 📄 errorHandler.js   ← Global error handler
│   │   │   ├── 📄 rateLimiter.js    ← Rate limiting
│   │   │   └── 📄 validate.js       ← Zod validation middleware
│   │   ├── 📂 routes/
│   │   │   ├── 📄 index.js          ← Route aggregator + health
│   │   │   └── 📄 auth.routes.js    ← Auth endpoints
│   │   ├── 📂 controllers/
│   │   │   └── 📄 auth.controller.js
│   │   ├── 📂 services/
│   │   │   └── 📄 auth.service.js
│   │   └── 📂 utils/
│   │       └── 📄 logger.js         ← Winston logger
│   └── 📂 tests/
│       └── 📄 auth.test.js          ← Auth endpoint tests
│
├── 📂 frontend/                      ← Next.js 14 App
│   ├── 📄 package.json
│   ├── 📄 package-lock.json
│   ├── 📄 next.config.js            ← API rewrites
│   ├── 📄 jsconfig.json
│   ├── 📄 .env.local                ← Frontend env (git-ignored)
│   ├── 📂 app/
│   │   ├── 📄 layout.js             ← Root layout (fonts, meta)
│   │   ├── 📄 page.js               ← Landing page
│   │   ├── 📄 globals.css           ← Global + imported tokens
│   │   ├── 📂 (guest)/
│   │   │   ├── 📂 concierge/
│   │   │   │   └── 📄 page.js       ← Placeholder
│   │   │   ├── 📂 requests/
│   │   │   │   └── 📄 page.js
│   │   │   ├── 📂 feedback/
│   │   │   │   └── 📄 page.js
│   │   │   └── 📂 explore/
│   │   │       └── 📄 page.js
│   │   ├── 📂 (staff)/
│   │   │   ├── 📂 dashboard/
│   │   │   │   └── 📄 page.js
│   │   │   ├── 📂 requests/
│   │   │   │   └── 📄 page.js
│   │   │   └── 📂 coordination/
│   │   │       └── 📄 page.js
│   │   └── 📂 (admin)/
│   │       ├── 📂 analytics/
│   │       │   └── 📄 page.js
│   │       ├── 📂 knowledge-base/
│   │       │   └── 📄 page.js
│   │       └── 📂 settings/
│   │           └── 📄 page.js
│   ├── 📂 components/
│   │   ├── 📂 ui/                    ← Design system stubs
│   │   │   ├── 📄 Button.js
│   │   │   ├── 📄 Card.js
│   │   │   └── 📄 Input.js
│   │   ├── 📂 chat/                  ← Empty (Phase 3)
│   │   ├── 📂 dashboard/             ← Empty (Phase 2)
│   │   └── 📂 common/
│   │       ├── 📄 Navbar.js
│   │       └── 📄 Footer.js
│   ├── 📂 lib/
│   │   ├── 📄 api.js                ← API client wrapper
│   │   ├── 📄 auth.js               ← Auth context
│   │   └── 📄 utils.js              ← Utility functions
│   ├── 📂 styles/
│   │   ├── 📄 design-tokens.css     ← Color, spacing, typography
│   │   └── 📂 components/           ← Component CSS modules
│   └── 📂 public/
│       └── 📄 favicon.ico
│
├── 📂 ai-services/                   ← Python + FastAPI
│   ├── 📄 requirements.txt
│   ├── 📄 Dockerfile
│   ├── 📄 .env                      ← AI service env (git-ignored)
│   ├── 📂 .venv/                    ← Virtual env (git-ignored)
│   ├── 📂 app/
│   │   ├── 📄 __init__.py
│   │   ├── 📄 main.py               ← FastAPI entry + health check
│   │   ├── 📄 config.py             ← Pydantic settings
│   │   ├── 📂 routers/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 concierge.py      ← Stub endpoints
│   │   │   ├── 📄 rag.py            ← Stub endpoints
│   │   │   └── 📄 sentiment.py      ← Stub endpoints
│   │   ├── 📂 services/
│   │   │   ├── 📄 __init__.py
│   │   │   ├── 📄 langchain_agent.py ← Skeleton
│   │   │   ├── 📄 rag_pipeline.py    ← Skeleton
│   │   │   ├── 📄 embedding_service.py ← Skeleton
│   │   │   └── 📄 sentiment_analyzer.py ← Skeleton
│   │   ├── 📂 models/
│   │   │   ├── 📄 __init__.py
│   │   │   └── 📄 schemas.py        ← Pydantic schemas
│   │   ├── 📂 prompts/
│   │   │   └── 📄 concierge_system.txt
│   │   └── 📂 knowledge_base/       ← Empty (Phase 3)
│   └── 📂 tests/
│       ├── 📄 __init__.py
│       └── 📄 test_health.py
│
└── 📂 n8n/                           ← Workflow Automation
    ├── 📂 workflows/                 ← Empty (Phase 4)
    └── 📂 credentials/              ← Git-ignored
```

> **Total Files Created in Phase 1: ~65 files**

---

## 🔨 Step-by-Step Coding Order

Phase 1 should be built in this exact order — each step builds on the previous one.

### 🔹 Step 1: Root Project Scaffolding (30 min)

**What:** Create directories, Git repo, environment config, and Docker Compose.

```
Files to create:
  .gitignore
  .env.example
  .env
  README.md
  docker-compose.yml
  docker-compose.dev.yml
  docs/architecture.md
  docs/environment.md
```

**Key deliverable:** `docker compose up -d` starts all 4 infrastructure services.

---

### 🔹 Step 2: Backend Scaffolding (1–2 hours)

**What:** Express.js project with middleware stack, config, and health endpoint.

```
Install commands:
  npm init -y
  npm i express cors helmet morgan dotenv prisma @prisma/client jsonwebtoken bcryptjs zod winston axios uuid
  npm i -D nodemon jest supertest eslint prettier

Files to create:
  backend/src/app.js
  backend/src/config/env.js
  backend/src/config/database.js
  backend/src/config/redis.js
  backend/src/middleware/errorHandler.js
  backend/src/middleware/rateLimiter.js
  backend/src/middleware/validate.js
  backend/src/routes/index.js
  backend/src/utils/logger.js
  backend/nodemon.json
  backend/Dockerfile
```

**Key deliverable:** `npm run dev` → `GET /api/health` returns `{"status":"ok"}`.

---

### 🔹 Step 3: Database Schema & Migrations (1 hour)

**What:** Full Prisma schema with all 12 models, initial migration, and seed data.

```
Commands:
  npx prisma init
  npx prisma migrate dev --name init
  npx prisma db seed

Files to create/edit:
  backend/prisma/schema.prisma   (12 models, all relations)
  backend/prisma/seed.js          (sample rooms, staff, guest)
```

**Key deliverable:** `npx prisma studio` shows all tables with seed data.

**Models to define:**
| Model | Key Fields |
|---|---|
| `Guest` | id, name, email, phone, preferences, loyaltyTier, passwordHash, role |
| `Booking` | id, guestId, roomId, checkIn, checkOut, status, totalAmount |
| `Room` | id, number, type, floor, status, ratePerNight |
| `Staff` | id, name, email, role, department, shift, available, passwordHash |
| `ServiceRequest` | id, guestId, staffId, category, description, priority, status |
| `ChatSession` | id, guestId, startedAt, endedAt, context |
| `ChatMessage` | id, sessionId, role, content, sentAt |
| `Feedback` | id, guestId, bookingId, rating, comment |
| `SentimentResult` | id, feedbackId, sentiment, score, keyPhrases |
| `KnowledgeDoc` | id, title, category, content |
| `EmbeddingChunk` | id, docId, chunkText, metadata |
| `Escalation` | id, requestId, reason, escalatedTo, escalatedAt |
| `Task` | id, staffId, requestId, description, status, dueAt |

---

### 🔹 Step 4: Auth System (1–2 hours)

**What:** JWT-based authentication with 3 roles: `guest`, `staff`, `admin`.

```
Files to create:
  backend/src/middleware/auth.js
  backend/src/middleware/authorize.js
  backend/src/routes/auth.routes.js
  backend/src/controllers/auth.controller.js
  backend/src/services/auth.service.js
```

**Endpoints:**
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new guest | No |
| `POST` | `/api/auth/login` | Login → returns JWT | No |
| `GET` | `/api/auth/me` | Get current user profile | Yes |
| `POST` | `/api/auth/staff/register` | Register staff (admin only) | Yes (admin) |

**Auth Flow:**
```
Register → hash password → save to DB → return JWT
Login → find user → compare hash → return JWT
Protected routes → check JWT → check role → proceed
```

---

### 🔹 Step 5: Frontend Scaffolding (1–2 hours)

**What:** Next.js 14 app with design system, landing page, and route stubs.

```
Command:
  npx -y create-next-app@latest frontend --js --app --no-tailwind --eslint --no-src-dir --import-alias "@/*"
  cd frontend && npm i lucide-react axios

Files to create:
  frontend/app/layout.js          (root layout with Inter font)
  frontend/app/page.js            (landing page)
  frontend/app/globals.css        (imports design tokens)
  frontend/styles/design-tokens.css
  frontend/next.config.js         (API proxy rewrites)
  frontend/lib/api.js
  frontend/lib/auth.js
  frontend/lib/utils.js
  frontend/components/ui/Button.js
  frontend/components/ui/Card.js
  frontend/components/ui/Input.js
  frontend/components/common/Navbar.js
  frontend/components/common/Footer.js
  + all route page.js stubs
```

**Key deliverable:** `npm run dev` → http://localhost:3000 shows a polished landing page.

---

### 🔹 Step 6: AI Services Scaffolding (1 hour)

**What:** FastAPI app with health check and router stubs for all AI features.

```
Commands:
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  pip install fastapi uvicorn[standard] python-dotenv pydantic pydantic-settings
  pip install langchain langchain-ollama langchain-community langchain-chroma langchain-huggingface
  pip install chromadb sentence-transformers vaderSentiment httpx tiktoken
  pip freeze > requirements.txt

Files to create:
  ai-services/app/__init__.py
  ai-services/app/main.py
  ai-services/app/config.py
  ai-services/app/routers/__init__.py
  ai-services/app/routers/concierge.py
  ai-services/app/routers/rag.py
  ai-services/app/routers/sentiment.py
  ai-services/app/services/__init__.py
  ai-services/app/services/langchain_agent.py  (skeleton)
  ai-services/app/services/rag_pipeline.py     (skeleton)
  ai-services/app/services/embedding_service.py (skeleton)
  ai-services/app/services/sentiment_analyzer.py (skeleton)
  ai-services/app/models/__init__.py
  ai-services/app/models/schemas.py
  ai-services/app/prompts/concierge_system.txt
  ai-services/Dockerfile
  ai-services/tests/__init__.py
  ai-services/tests/test_health.py
```

**Key deliverable:** `uvicorn app.main:app --reload` → http://localhost:8000/docs shows Swagger UI.

---

### 🔹 Step 7: Environment & CI Stub (30 min)

**What:** Finalize all `.env` files and create basic CI pipeline.

```
Files to create:
  .github/workflows/ci.yml
  docs/environment.md
  backend/.env
  frontend/.env.local
  ai-services/.env
```

---

## ⏱️ Phase 1 Time Estimates

| Step | Task | Estimated Time |
|---|---|---|
| Step 1 | Root scaffolding + Docker Compose | 30 min |
| Step 2 | Backend Express.js setup | 1–2 hours |
| Step 3 | Prisma schema + migrations + seed | 1 hour |
| Step 4 | Auth system (JWT + roles) | 1–2 hours |
| Step 5 | Frontend Next.js + design system | 1–2 hours |
| Step 6 | AI services FastAPI boilerplate | 1 hour |
| Step 7 | Environment config + CI stub | 30 min |
| | **Total** | **6–9 hours** |

---

## ✅ Phase 1 Definition of Done

When Phase 1 is complete, you should be able to:

1. **`docker compose up -d`** → All 4 infrastructure containers running (PostgreSQL, Redis, ChromaDB, n8n)
2. **`npm run dev` (backend)** → http://localhost:4000/api/health returns `{"status":"ok"}`
3. **`npm run dev` (frontend)** → http://localhost:3000 shows polished landing page
4. **`uvicorn` (ai-services)** → http://localhost:8000/docs shows Swagger UI
5. **Register a user** → `POST /api/auth/register` returns JWT
6. **Login** → `POST /api/auth/login` returns JWT
7. **Access protected route** → `GET /api/auth/me` with Bearer token returns user info
8. **Database** → `npx prisma studio` shows all 12+ tables with seed data
9. **n8n** → http://localhost:5678 accessible in browser

---

## 🔗 Stack Reference (100% Free)

| Component | Technology | Port |
|---|---|---|
| Frontend | Next.js 14 | 3000 |
| Backend API | Express.js | 4000 |
| AI Services | FastAPI | 8000 |
| PostgreSQL | Docker | 5432 |
| Redis | Docker | 6379 |
| ChromaDB | Docker | 8100 |
| n8n | Docker | 5678 |
| Ollama (LLM) | Local | 11434 |

---

> [!IMPORTANT]
> **Ready to start coding?** Tell me to begin and I'll scaffold everything — creating every single file listed above with production-quality code. We'll go step by step, starting with the root project + Docker Compose, then backend, database, auth, frontend, and AI services.

> [!TIP]
> **Recommended approach:** Let me build each step, then you run the verification commands to confirm everything works before moving to the next step. This way we catch issues early.
