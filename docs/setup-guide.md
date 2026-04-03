# 🚀 Setup Guide

> Step-by-step instructions to get the Smart Hospitality Management system running locally.

---

## Prerequisites

| Tool | Version | Check Command |
|---|---|---|
| Node.js | 20+ LTS | `node --version` |
| Python | 3.11+ | `python --version` |
| Docker Desktop | Latest | `docker --version` |
| Git | Latest | `git --version` |
| Ollama | Latest | `ollama --version` |

---

## Step 1: Clone & Configure

```bash
git clone <repo-url>
cd Smart-Hospitality-Management
cp .env.example .env
# Edit .env with your values
```

## Step 2: Start Infrastructure

```bash
docker compose up -d
docker compose ps    # Verify all containers running
```

## Step 3: Start Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed   # Optional: load sample data
npm run dev          # → http://localhost:4000
```

## Step 4: Start AI Services

```bash
cd ai-services
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000  # → http://localhost:8000
```

## Step 5: Start Frontend

```bash
cd frontend
npm install
npm run dev          # → http://localhost:3000
```

## Step 6: Start Ollama

```bash
ollama pull llama3.1
ollama serve         # → http://localhost:11434
```

---

## Verification

| Service | URL | Expected |
|---|---|---|
| Frontend | http://localhost:3000 | Landing page |
| Backend | http://localhost:4000/api/health | `{"status":"ok"}` |
| AI Services | http://localhost:8000/docs | Swagger UI |
| PostgreSQL | `docker exec hospitality-postgres psql -U hospitality_admin -c "SELECT 1;"` | Returns 1 |
| Redis | `docker exec hospitality-redis redis-cli ping` | PONG |
| ChromaDB | http://localhost:8100/api/v1/heartbeat | JSON |
| n8n | http://localhost:5678 | Login page |
