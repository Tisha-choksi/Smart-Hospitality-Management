# 📐 System Architecture — Smart Hospitality Management

---

## High-Level Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Frontend (Next.js 14)"]
        GuestPortal["Guest Portal"]
        StaffDashboard["Staff Dashboard"]
        AdminPanel["Admin Panel"]
    end

    subgraph API["⚙️ Backend (Node.js / Express)"]
        AuthService["Auth Service"]
        GuestAPI["Guest API"]
        StaffAPI["Staff API"]
        ConciergeAPI["AI Concierge API"]
        FeedbackAPI["Feedback API"]
        AnalyticsAPI["Analytics API"]
    end

    subgraph AI["🤖 AI Services (Python / FastAPI)"]
        LangChainAgent["LangChain Agent"]
        RAGPipeline["RAG Pipeline"]
        SentimentEngine["Sentiment Analysis"]
        EmbeddingService["Embedding Service"]
    end

    subgraph Automation["🔄 n8n Automation"]
        GuestRequestWF["Guest Request Workflows"]
        StaffCoordWF["Staff Coordination"]
        NotificationWF["Notification Workflows"]
        EscalationWF["Escalation Workflows"]
    end

    subgraph Data["💾 Data Layer"]
        PostgreSQL["PostgreSQL (Primary DB)"]
        ChromaDB["ChromaDB (Vector Store)"]
        Redis["Redis (Cache / Sessions)"]
    end

    subgraph LLM["🧠 LLM Layer"]
        Ollama["Ollama (Local LLM)"]
        HFEmbeddings["HuggingFace Embeddings"]
    end

    Client --> API
    API --> AI
    API --> Automation
    API --> Data
    AI --> Data
    AI --> LLM
    Automation --> API
```

---

## Service Communication

| From | To | Protocol | Purpose |
|---|---|---|---|
| Frontend | Backend | HTTP REST | User actions, data CRUD |
| Backend | AI Services | HTTP REST | AI concierge, sentiment analysis |
| Backend | n8n | Webhook POST | Trigger automated workflows |
| n8n | Backend | HTTP REST | Update records, fetch data |
| AI Services | ChromaDB | HTTP | Vector store operations |
| AI Services | Ollama | HTTP | LLM inference |
| Backend | PostgreSQL | TCP (Prisma) | Data persistence |
| Backend | Redis | TCP | Session cache, rate limiting |

---

## Data Flow: Guest Request

```mermaid
sequenceDiagram
    participant G as Guest
    participant FE as Frontend
    participant BE as Backend
    participant N8 as n8n
    participant AI as AI Services
    participant DB as PostgreSQL

    G->>FE: Submit service request
    FE->>BE: POST /api/requests
    BE->>DB: Save request
    BE->>N8: Webhook → request routing
    N8->>AI: Classify request category
    AI-->>N8: Category + priority
    N8->>DB: Find available staff
    N8->>BE: Assign staff to request
    BE->>DB: Update assignment
    N8->>G: Send notification (email/SMS)
    Note over N8: Wait 10 min
    N8->>BE: Check acknowledgment
    alt Not acknowledged
        N8->>BE: Escalate request
    end
```

---

## Data Flow: AI Concierge Chat

```mermaid
sequenceDiagram
    participant G as Guest
    participant FE as Frontend
    participant BE as Backend
    participant AI as AI Services
    participant VDB as ChromaDB
    participant LLM as Ollama

    G->>FE: Type message
    FE->>BE: POST /api/concierge/chat
    BE->>AI: Forward to AI service
    AI->>VDB: Similarity search (RAG)
    VDB-->>AI: Relevant context chunks
    AI->>AI: Assemble prompt (system + context + history + query)
    AI->>LLM: Generate response
    LLM-->>AI: AI response
    AI-->>BE: Response + metadata
    BE->>BE: Save to chat history
    BE-->>FE: Stream response
    FE-->>G: Display AI response
```

---

## Database Schema (ER Diagram)

```mermaid
erDiagram
    GUEST ||--o{ BOOKING : makes
    GUEST ||--o{ SERVICE_REQUEST : submits
    GUEST ||--o{ FEEDBACK : provides
    GUEST ||--o{ CHAT_SESSION : initiates
    BOOKING ||--|| ROOM : assigns
    SERVICE_REQUEST ||--o| STAFF : assigned_to
    SERVICE_REQUEST ||--o| ESCALATION : has
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains
    FEEDBACK ||--o| SENTIMENT_RESULT : analyzed_by
    STAFF ||--o{ TASK : handles
    KNOWLEDGE_DOC ||--o{ EMBEDDING_CHUNK : vectorized_into
```

---

## Port Mapping

| Service | Port | Description |
|---|---|---|
| Frontend (Next.js) | 3000 | Guest, Staff, Admin UI |
| Backend (Express) | 4000 | REST API |
| AI Services (FastAPI) | 8000 | AI/ML endpoints |
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache & sessions |
| ChromaDB | 8100 | Vector database |
| n8n | 5678 | Workflow automation |
| Ollama | 11434 | Local LLM |
| Prisma Studio | 5555 | DB admin UI (dev only) |

---

## Security Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  (HTTPS, CSRF prevention, input sanitizing) │
└──────────────────┬──────────────────────────┘
                   │ JWT Bearer Token
┌──────────────────▼──────────────────────────┐
│                  Backend                     │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │  CORS   │ │ Rate     │ │ JWT Auth +   │ │
│  │ Filter  │ │ Limiter  │ │ Role Check   │ │
│  └─────────┘ └──────────┘ └──────────────┘ │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Helmet  │ │ Zod      │ │ bcrypt       │ │
│  │ Headers │ │ Validate │ │ Password Hash│ │
│  └─────────┘ └──────────┘ └──────────────┘ │
└─────────────────────────────────────────────┘
```
