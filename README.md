# Smart Hospitality Management

A full-stack hospitality platform for guest operations, service requests, bookings, payments, feedback analytics, and AI concierge support.

## Overview

This repository contains three applications:

- Frontend: React web application
- Backend: Node.js + Express API with Prisma and PostgreSQL
- AI Engine: FastAPI service for chat, sentiment, and knowledge-based responses

The backend and AI engine are designed to run together in one Dockerized Render service.

## Core Features

- User authentication and role-based access (Guest, Staff, Admin)
- Service request management
- Booking management
- Stripe payment integration
- Feedback collection and analytics
- AI concierge chat
- AI sentiment analysis
- AI RAG-style hotel information responses

## Architecture

```mermaid
flowchart LR
    U[User Browser]
    F[React Frontend\nVercel]
    B[Express Backend\nRender Docker Service]
    A[FastAPI AI Engine\nSame Render Docker Service]
    D[(PostgreSQL\nRender Database)]
    S[Stripe API]

    U --> F
    F -->|REST /api/*| B
    F -->|REST /api/ai/*| B
    B -->|Proxy /api/ai| A
    B --> D
    B --> S
```

## Runtime Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant AI
    participant DB

    User->>Frontend: Open application
    Frontend->>Backend: Login/Register request
    Backend->>DB: Validate or create user
    DB-->>Backend: User data
    Backend-->>Frontend: JWT token + profile

    User->>Frontend: Ask AI question
    Frontend->>Backend: POST /api/ai/chat
    Backend->>AI: Proxy request
    AI-->>Backend: AI response
    Backend-->>Frontend: AI response
```

## Repository Structure

```text
ai-services/   FastAPI AI service
backend/       Express API + Prisma
frontend/      React application
Dockerfile     Unified container build
start.sh       Unified startup script
render.yaml    Render Blueprint configuration
```

## API Surface

### Backend Routes

- /api/auth
- /api/guests
- /api/staff
- /api/requests
- /api/feedback
- /api/analytics
- /api/bookings
- /api/payments

### AI Routes (via backend proxy)

- /api/ai/chat
- /api/ai/sentiment/analyze
- /api/ai/rag/query
- /api/ai/health

## Data Model Summary

```mermaid
erDiagram
    USER ||--o{ SERVICE_REQUEST : creates
    USER ||--o{ FEEDBACK : submits
    USER ||--o{ BOOKING : owns
    USER ||--o{ PAYMENT : makes
    BOOKING ||--o{ PAYMENT : has

    USER {
      string id
      string email
      string role
      string name
    }
    SERVICE_REQUEST {
      string id
      string guestId
      string status
      string type
    }
    FEEDBACK {
      string id
      string guestId
      int rating
      string sentiment
    }
    BOOKING {
      string id
      string guestId
      string status
      float totalPrice
    }
    PAYMENT {
      string id
      string userId
      string bookingId
      string status
      float amount
    }
```

## Local Development

## 1) Backend

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

## 2) AI Engine

```bash
cd ai-services
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8001 --reload
```

## 3) Frontend

```bash
cd frontend
npm install
npm start
```

## Docker Local Run

```bash
docker build -t hospitality-api .
docker run -p 10000:10000 --env-file .env hospitality-api
```

Service endpoints:

- Backend: <http://localhost:10000/api>
- AI Proxy: <http://localhost:10000/api/ai>

## Deployment

Use Render Blueprint with render.yaml.

### Required Render Environment Variables

- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRY
- GROQ_API_KEY
- GOOGLE_API_KEY
- STRIPE_SECRET_KEY
- EMAIL_USER (optional)
- EMAIL_PASS (optional)

### Frontend Environment Variables (Vercel)

```bash
REACT_APP_API_URL=https://your-render-service.onrender.com/api
REACT_APP_AI_URL=https://your-render-service.onrender.com/api/ai
```

## Health Checks

- Backend auth check: GET /api/auth/me (expects 401 without token)
- AI health check: GET /api/ai/health

## Technology Stack

- Frontend: React, React Router
- Backend: Node.js, Express, Prisma
- Database: PostgreSQL
- AI Engine: FastAPI, Groq, Gemini, Sentence Transformers, VADER
- Payments: Stripe
- Deployment: Docker, Render, Vercel

## Notes

- Backend and AI run in a single container process model using start.sh.
- Prisma migrations are executed at container start when DATABASE_URL is present.
- The backend proxies AI traffic, so frontend should always call /api/ai through the backend URL.
