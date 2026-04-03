# 🏨 Smart Hospitality Management System

> **AI-Powered Hospitality Platform — 100% Free Stack**

An enterprise-grade hospitality management system with AI concierge, RAG-based knowledge base, guest/staff dashboards, sentiment analysis, and workflow automation.

**Built with:** Next.js 14 | FastAPI | Node.js + Express | Supabase | Groq | ChromaDB | n8n

---

## 🎯 Key Features

✅ **Guest Portal** — Booking, requests, feedback, AI concierge chat
✅ **Staff Dashboard** — Request queue, task management, real-time alerts
✅ **Admin Panel** — Analytics, knowledge base management, user control
✅ **AI Concierge** — RAG-powered Q&A (hotel FAQs, policies, recommendations)
✅ **Sentiment Analysis** — Guest feedback analysis with automatic escalation
✅ **Workflow Automation** — Request routing, notifications, escalation pipelines
✅ **100% Free** — No credit card, $0/month (Groq, Supabase, Render, Vercel)

---

## 📚 Stack

| Layer | Tech | Why |
|---|---|---|
| **Frontend** | Next.js 14 | SSR, API routes, fast, Vercel deploy |
| **Backend API** | Node.js + Express | Lightweight, free Render hosting |
| **AI Services** | Python + FastAPI | ML ecosystem, free Render hosting |
| **LLM (Primary)** | Groq (Llama 3.3 70B) | Free tier, blazing fast |
| **LLM (Fallback)** | Google Gemini | Free tier, reliable backup |
| **Embeddings** | sentence-transformers | Local, CPU-only, zero cost |
| **Vector DB** | ChromaDB | Local or cloud, free, open-source |
| **Database** | Supabase (PostgreSQL) | Free 500MB, managed, Auth included |
| **Cache** | Upstash Redis | Free 10K cmd/day |
| **Email** | Resend | Free 100 emails/day |
| **Automation** | n8n (self-hosted) | Free, open-source |
| **Frontend Deploy** | Vercel | Free hobby plan |
| **Backend Deploy** | Render | Free tier |
| **CI/CD** | GitHub Actions | Free |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **Python 3.10+**
- **Git**
- Free API keys (Groq, Gemini, Supabase, Upstash, Resend)

### Installation

1. **Clone and setup monorepo:**
```bash
git clone <repo-url>
cd Smart-Hospitality-Management
cp .env.example .env
# Edit .env with your API keys
npm install
```

2. **Install dependencies for all services:**
```bash
npm run setup
```

3. **Setup database:**
```bash
npm run db:migrate
npm run db:seed
```

4. **Start all services (concurrently):**
```bash
npm run dev
```

This will start:
- **Frontend** → `http://localhost:3000`
- **Backend API** → `http://localhost:3000/api` (proxy)
- **AI Services** → `http://localhost:8001`

---

## 📁 Project Structure

```
Smart-Hospitality-Management/
├── frontend/                    # Next.js 14 application
│   ├── app/
│   │   ├── (auth)/              # Login/Register pages
│   │   ├── (guest)/             # Guest portal
│   │   ├── (staff)/             # Staff dashboard
│   │   └── (admin)/             # Admin panel
│   ├── components/              # Reusable UI components
│   ├── lib/                     # Utilities, API client
│   └── public/                  # Static assets
│
├── backend/                     # Express.js API server
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Auth, error handling
│   │   ├── services/            # External integrations
│   │   └── db/                  # Prisma schema & migrations
│   └── prisma/
│       └── schema.prisma        # Database schema
│
├── ai-services/                 # FastAPI + Python
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── routers/             # API endpoints
│   │   ├── services/            # RAG, LLM, sentiment
│   │   └── models/              # Pydantic models
│   ├── requirements.txt         # Python dependencies
│   └── chroma-data/             # Local vector DB
│
├── .github/
│   └── workflows/               # CI/CD pipelines
│       ├── ci.yml               # Lint + test
│       ├── deploy-frontend.yml  # Deploy to Vercel
│       └── deploy-backend.yml   # Deploy to Render
│
├── .env.example                 # Environment variables template
├── .gitignore
├── README.md
└── package.json                 # Root scripts
```

---

## 🔄 Development Workflow

### Start all services:
```bash
npm run dev
```

### Individual service startup:
```bash
npm run dev:frontend    # Only frontend
npm run dev:backend     # Only backend
npm run dev:ai          # Only AI services
```

### Database operations:
```bash
npm run db:migrate      # Run migrations
npm run db:seed         # Populate sample data
npm run db:reset        # Reset database
```

### Testing & Linting:
```bash
npm run test            # Run all tests
npm run lint            # Lint all services
```

---

## 🔐 Environment Variables

Copy `.env.example` → `.env` and fill in your credentials:

```bash
cp .env.example .env
```

**Required keys:**
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` (free from supabase.com)
- `GROQ_API_KEY` (free from console.groq.com)
- `GEMINI_API_KEY` (free from aistudio.google.com)
- `UPSTASH_REDIS_URL`, `UPSTASH_REDIS_TOKEN` (free from upstash.com)
- `RESEND_API_KEY` (free from resend.com)

---

## 📖 API Documentation

### Backend (Express) Routes
- `POST /api/auth/register` — Register guest/staff
- `POST /api/auth/login` — Login
- `GET /api/guests/:id` — Get guest profile
- `POST /api/requests` — Create service request
- `GET /api/requests` — List requests (paginated)
- `POST /api/feedback` — Submit guest feedback

### AI Services (FastAPI) Routes
- `POST /ai/concierge/chat` — AI chat with RAG
- `POST /ai/rag/ingest` — Upload document to knowledge base
- `POST /ai/rag/query` — Query knowledge base
- `POST /ai/sentiment/analyze` — Analyze text sentiment
- `POST /ai/sentiment/batch` — Batch sentiment analysis

See detailed API docs in `/backend/API.md` and `/ai-services/API.md`.

---

## 🧪 Testing

All services have test suites:

```bash
# Backend (Jest + Supertest)
npm run test:backend

# AI Services (Pytest)
npm run test:ai
```

---

## 🚀 Deployment

### Frontend → Vercel (Free)
```bash
vercel deploy
```

### Backend → Render (Free)
```bash
git push origin main  # Auto-deploys via GitHub integration
```

### AI Services → Render (Free)
```bash
git push origin main  # Auto-deploys via GitHub integration
```

---

## 📝 Phase Roadmap

- **Phase 1** ✅ Project scaffolding + setup
- **Phase 2** — Core guest/staff APIs + portals
- **Phase 3** — RAG pipeline + AI concierge
- **Phase 4** — Workflow automation (n8n)
- **Phase 5** — Sentiment analysis + analytics
- **Phase 6** — CI/CD pipelines
- **Phase 7** — Polish + production readiness

---

## 💰 Cost Breakdown

| Service | Free Tier | Cost |
|---|---|---|
| Groq API | 30 RPM, 1K RPD | $0 |
| Google Gemini | 15 RPM, 250K TPM | $0 |
| Supabase | 500 MB, 50K MAUs | $0 |
| Upstash Redis | 10K cmd/day, 256 MB | $0 |
| Resend | 100 emails/day | $0 |
| ChromaDB | Unlimited (local) | $0 |
| Vercel | Hobby plan | $0 |
| Render | Free tier (cold start) | $0 |
| GitHub Actions | 2K min/month (private) | $0 |
| **TOTAL** | | **$0/month** |

---

## 🐛 Troubleshooting

### Port conflicts?
```bash
# Check what's using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Python venv issues?
```bash
cd ai-services
python -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### ChromaDB not connecting?
```bash
# ChromaDB runs in-process (embedded mode)
# No separate service needed - it's handled in FastAPI
```

---

## 📞 Support

- 📖 **Docs**: See individual service READMEs
- 🐛 **Issues**: Create GitHub issue
- 💬 **Discussions**: GitHub Discussions tab

---

## 📄 License

MIT

---

**Built with ❤️ for hospitality teams everywhere.**