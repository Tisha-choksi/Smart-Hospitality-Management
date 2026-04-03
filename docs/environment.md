# 🔐 Environment Variables Reference

> All environment variables used across the Smart Hospitality Management system.

---

## Setup

```bash
# Copy template to create your local config
cp .env.example .env

# Edit with your values
notepad .env    # Windows
```

---

## Variable Reference

### General

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Environment: `development`, `staging`, `production` |
| `APP_NAME` | `SmartHospitality` | Application name used in logs and emails |

### PostgreSQL

| Variable | Default | Required | Description |
|---|---|---|---|
| `POSTGRES_HOST` | `localhost` | ✅ | Database host |
| `POSTGRES_PORT` | `5432` | ✅ | Database port |
| `POSTGRES_DB` | `hospitality_db` | ✅ | Database name |
| `POSTGRES_USER` | `hospitality_admin` | ✅ | Database user |
| `POSTGRES_PASSWORD` | — | ✅ | Database password |
| `DATABASE_URL` | — | ✅ | Full Prisma connection string |

### Redis

| Variable | Default | Required | Description |
|---|---|---|---|
| `REDIS_HOST` | `localhost` | ✅ | Redis host |
| `REDIS_PORT` | `6379` | ✅ | Redis port |
| `REDIS_PASSWORD` | — | ✅ | Redis password |

### Backend (Express.js)

| Variable | Default | Required | Description |
|---|---|---|---|
| `BACKEND_PORT` | `4000` | ✅ | Express server port |
| `JWT_SECRET` | — | ✅ | Secret for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | `7d` | ❌ | JWT token expiry duration |
| `CORS_ORIGIN` | `http://localhost:3000` | ✅ | Allowed CORS origin |

### Frontend (Next.js)

| Variable | Default | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | ✅ | Backend API base URL |
| `NEXT_PUBLIC_AI_API_URL` | `http://localhost:8000/ai` | ✅ | AI services base URL |
| `NEXT_PUBLIC_APP_NAME` | `Smart Hospitality` | ❌ | Displayed app name |

### AI Services (FastAPI)

| Variable | Default | Required | Description |
|---|---|---|---|
| `AI_SERVICE_PORT` | `8000` | ✅ | FastAPI server port |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | ✅ | Ollama API endpoint |
| `OLLAMA_MODEL` | `llama3.1` | ✅ | LLM model name |
| `EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | ✅ | Embedding model name |

### ChromaDB

| Variable | Default | Required | Description |
|---|---|---|---|
| `CHROMA_HOST` | `localhost` | ✅ | ChromaDB host |
| `CHROMA_PORT` | `8100` | ✅ | ChromaDB port |

### n8n

| Variable | Default | Required | Description |
|---|---|---|---|
| `N8N_PORT` | `5678` | ✅ | n8n web UI port |
| `N8N_BASIC_AUTH_USER` | `admin` | ✅ | n8n login username |
| `N8N_BASIC_AUTH_PASSWORD` | — | ✅ | n8n login password |
| `N8N_WEBHOOK_URL` | `http://localhost:5678` | ✅ | n8n webhook base URL |
| `BACKEND_WEBHOOK_SECRET` | — | ✅ | Secret for webhook verification |

### Email (Gmail SMTP)

| Variable | Default | Required | Description |
|---|---|---|---|
| `EMAIL_HOST` | `smtp.gmail.com` | ❌ | SMTP host |
| `EMAIL_PORT` | `587` | ❌ | SMTP port |
| `EMAIL_USER` | — | ❌ | Gmail address |
| `EMAIL_APP_PASSWORD` | — | ❌ | Gmail app password |

---

## Per-Service .env Files

Each service reads from the root `.env` file or its own local copy:

| Service | File | Notes |
|---|---|---|
| Root / Docker | `.env` | Used by Docker Compose |
| Backend | `backend/.env` | Symlink or copy of root `.env` |
| Frontend | `frontend/.env.local` | Only `NEXT_PUBLIC_*` variables |
| AI Services | `ai-services/.env` | Only AI-related variables |
