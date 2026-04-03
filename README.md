# 🏨 Smart Hospitality Management System

> AI-powered hospitality platform integrating RAG-based concierge, workflow automation, sentiment analysis, and intelligent operations management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Required-blue.svg)

---

## ✨ Features

- **🤖 AI Concierge** — LangChain-powered chatbot with RAG pipeline for hotel knowledge retrieval
- **📋 Service Request Management** — Automated routing, assignment, and escalation
- **📊 Sentiment Analysis** — Real-time guest feedback analysis with alerting
- **🔄 Workflow Automation** — n8n-powered operational workflows
- **👥 Multi-Role Portal** — Separate interfaces for guests, staff, and administrators
- **🔐 Secure Auth** — JWT-based authentication with role-based access control
- **📈 Analytics Dashboard** — Operational metrics and sentiment trend visualization

---

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  AI Services │
│  (Next.js)   │     │  (Express)   │     │  (FastAPI)   │
│  Port: 3000  │     │  Port: 4000  │     │  Port: 8000  │
└──────────────┘     └──────┬───────┘     └──────┬───────┘
                            │                     │
                    ┌───────┴──────┐       ┌──────┴───────┐
                    │              │       │              │
               ┌────┴────┐  ┌────┴────┐  ┌┴─────────┐  ┌┴──────┐
               │PostgreSQL│  │  Redis  │  │ ChromaDB │  │Ollama │
               │  :5432   │  │  :6379  │  │  :8100   │  │:11434 │
               └──────────┘  └─────────┘  └──────────┘  └───────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router) |
| **Backend** | Node.js + Express.js |
| **AI Services** | Python + FastAPI + LangChain |
| **LLM** | Ollama (Llama 3.1 — local, free) |
| **Embeddings** | HuggingFace all-MiniLM-L6-v2 |
| **Vector DB** | ChromaDB |
| **Database** | PostgreSQL (Prisma ORM) |
| **Cache** | Redis |
| **Automation** | n8n (self-hosted) |
| **Sentiment** | VADER + HuggingFace Transformers |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Python 3.11+](https://python.org)
- [Docker Desktop](https://docker.com/products/docker-desktop)
- [Ollama](https://ollama.com) (for local LLM)
- [Git](https://git-scm.com)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd Smart-Hospitality-Management

# 2. Copy environment config
cp .env.example .env

# 3. Start infrastructure services
docker compose up -d

# 4. Setup backend
cd backend
npm install
npx prisma migrate dev
npm run dev                # → http://localhost:4000

# 5. Setup AI services (new terminal)
cd ai-services
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000  # → http://localhost:8000

# 6. Setup frontend (new terminal)
cd frontend
npm install
npm run dev                # → http://localhost:3000

# 7. Setup Ollama (new terminal)
ollama pull llama3.1
ollama serve               # → http://localhost:11434
```

### Verify Services

| Service | URL | Expected |
|---|---|---|
| Frontend | http://localhost:3000 | Landing page |
| Backend | http://localhost:4000/api/health | `{"status":"ok"}` |
| AI Services | http://localhost:8000/docs | Swagger UI |
| n8n | http://localhost:5678 | Login page |
| ChromaDB | http://localhost:8100/api/v1/heartbeat | Heartbeat JSON |

---

## 📁 Project Structure

```
Smart Hospitality Management/
├── frontend/          # Next.js 14 — Guest, Staff, Admin portals
├── backend/           # Express.js — REST API, auth, business logic
├── ai-services/       # FastAPI — RAG pipeline, AI concierge, sentiment
├── n8n/               # Workflow automation configs
├── docs/              # Architecture & API documentation
├── .github/workflows/ # CI/CD pipelines
└── docker-compose.yml # Infrastructure orchestration
```

---

## 📋 Development Phases

| Phase | Description | Status |
|---|---|---|
| **Phase 1** | Foundation & Setup | 🔄 In Progress |
| **Phase 2** | Core Guest Management | ⏳ Planned |
| **Phase 3** | RAG Pipeline & AI Concierge | ⏳ Planned |
| **Phase 4** | n8n Workflow Automation | ⏳ Planned |
| **Phase 5** | Sentiment Analysis & Analytics | ⏳ Planned |
| **Phase 6** | CI/CD & DevOps | ⏳ Planned |
| **Phase 7** | Polish & Production Readiness | ⏳ Planned |

---

## 📄 License

This project is licensed under the MIT License.
