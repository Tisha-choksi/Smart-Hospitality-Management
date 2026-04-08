# Smart Hospitality Management System

A comprehensive hotel management solution featuring role-based access control, AI-powered guest services, real-time notifications, and payment processing.

---

## Table of Contents

- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Key Features](#key-features)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Default Credentials](#default-credentials)

---

## Architecture

```mermaid
graph TB
    subgraph Frontend["Frontend (React)"]
        UI[UI Components]
        Router[React Router]
        Context[Auth Context]
        WebSocket[Socket.io Client]
    end

    subgraph Backend["Backend (Express.js)"]
        API[REST API]
        WS[WebSocket Server]
        Auth[JWT Middleware]
        Routes[API Routes]
        Services[Business Services]
        Prisma[Prisma ORM]
    end

    subgraph Database["Database"]
        PostgreSQL[(PostgreSQL)]
    end

    subgraph AIServices["AI Services (FastAPI)"]
        Chat[AI Chat Endpoint]
        RAG[RAG Knowledge Base]
        Sentiment[Sentiment Analysis]
        LLM[LLM Integration]
        Embeddings[Embedding Service]
        ChromaDB[(ChromaDB Vector DB)]
    end

    Frontend --> |HTTP/WebSocket| Backend
    Backend --> |ORM| PostgreSQL
    Backend --> |HTTP| AIServices
    AIServices --> ChromaDB
    AIServices --> |Groq/Gemini API| LLM

    style Frontend fill:#61dafb,color:#000
    style Backend fill:#68a063,color:#fff
    style AIServices fill:#ff6b6b,color:#fff
    style Database fill:#336791,color:#fff
```

### User Role Flow

```mermaid
graph LR
    A[Guest] -->|Register/Login| B[Dashboard]
    B -->|Book Room| C[Booking System]
    B -->|Request Service| D[Service Requests]
    B -->|Provide Feedback| E[Feedback + AI Sentiment]
    B -->|Chat| F[AI Concierge]
    B -->|Make Payment| G[Stripe Payment]

    H[Staff/Admin] -->|View| I[Analytics Dashboard]
    H -->|Manage| J[Guests & Bookings]
    H -->|Handle| K[Service Requests]
    H -->|Monitor| L[Feedback & Sentiment]
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI framework |
| React Router | 6.20.0 | Client-side routing |
| Axios | 1.6.0 | HTTP client |
| @stripe/react-stripe-js | 6.1.0 | Payment UI |
| @stripe/stripe-js | 9.1.0 | Stripe.js |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.18.2 | Web framework |
| Prisma | 5.0.0 | ORM |
| PostgreSQL | - | Database |
| JWT | 9.0.0 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |
| Socket.io | 4.8.3 | Real-time notifications |
| Stripe | 22.0.0 | Payment processing |
| Nodemailer | 8.0.5 | Email service |

### AI Services

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.109.0 | Python web framework |
| Groq SDK | 0.4.2 | LLM API (Mixtral) |
| Google Generative AI | 0.3.0 | Gemini LLM |
| Sentence Transformers | 2.2.2 | Text embeddings |
| ChromaDB | 0.4.22 | Vector database |
| VADER Sentiment | 3.2.1.1 | Sentiment analysis |

---

## Directory Structure

```
Smart Hospitality Management/
|
|-- frontend/                     # React.js Frontend
|   |-- public/
|   |   |-- index.html
|   |   |-- manifest.json
|   |   |-- logo192.png
|   |   |-- logo512.png
|   |   |-- robots.txt
|   |-- src/
|   |   |-- api/
|   |   |   |-- apiClient.js     # Axios configuration
|   |   |-- components/
|   |   |   |-- AIChat.js        # AI chatbot widget
|   |   |   |-- Footer.js        # Footer
|   |   |   |-- Navbar.js        # Navigation bar
|   |   |   |-- Notifications.js # WebSocket notifications
|   |   |   |-- PrivateRoute.js  # Route protection HOC
|   |   |   |-- StripePayment.js # Stripe payment form
|   |   |-- contexts/
|   |   |   |-- AuthContext.js   # Authentication state
|   |   |-- pages/
|   |   |   |-- Anakytics.js     # Analytics dashboard
|   |   |   |-- Bookings.js      # Booking management
|   |   |   |-- Dashboard.js     # Main dashboard
|   |   |   |-- Feedback.js      # Guest feedback
|   |   |   |-- Home.js          # Landing page
|   |   |   |-- Login.js         # Login
|   |   |   |-- Profile.js       # User profile
|   |   |   |-- Register.js      # Registration
|   |   |-- styles/
|   |   |-- App.js               # Router & layout
|   |   |-- index.js             # Entry point
|   |-- .env
|   |-- package.json
|
|-- backend/                      # Express.js Backend
|   |-- prisma/
|   |   |-- schema.prisma        # Database schema
|   |   |-- seed.js              # Database seed
|   |-- src/
|   |   |-- database.js          # Prisma client
|   |   |-- index.js             # Express server
|   |   |-- middleware.js        # Auth & error handling
|   |   |-- routes/
|   |   |   |-- analytics.js     # Analytics endpoints
|   |   |   |-- auth.js          # Authentication
|   |   |   |-- bookings.js      # Booking CRUD
|   |   |   |-- feedback.js      # Guest feedback
|   |   |   |-- guests.js        # Guest management
|   |   |   |-- payments.js      # Stripe payments
|   |   |   |-- requests.js      # Service requests
|   |   |   |-- staff.js         # Staff management
|   |   |-- services/
|   |   |   |-- auth.js          # Auth service
|   |   |   |-- email.js         # Email service
|   |-- render.yaml              # Deployment config
|   |-- .env
|   |-- package.json
|
|-- ai-services/                  # FastAPI AI Microservices
|   |-- app.py                    # FastAPI application
|   |-- config.py                 # Configuration
|   |-- requirements.txt          # Python dependencies
|   |-- knowledge/
|   |   |-- faq.txt              # FAQ knowledge base
|   |   |-- hotel_info.txt       # Hotel information
|   |   |-- policies.txt         # Hotel policies
|   |-- models/
|   |   |-- schemas.py           # Pydantic models
|   |-- routes/
|   |   |-- chat.py              # AI chat endpoint
|   |   |-- rag.py               # RAG query endpoint
|   |   |-- sentiment.py         # Sentiment analysis
|   |-- services/
|   |   |-- embeddings.py        # Text embeddings
|   |   |-- llm.py               # LLM integration
|   |   |-- sentiment.py         # VADER sentiment
|   |-- .env
|
|-- .env                          # Root environment
|-- .gitignore
|-- README.md
```

---

## Key Features

### Guest Features
- User registration and login with JWT authentication
- Browse and book rooms (Standard, Double, Suite, Deluxe)
- Submit service requests (cleaning, maintenance, room service, front desk)
- Rate and review services with AI-powered sentiment analysis
- 24/7 AI concierge chatbot assistance
- Secure credit card payments via Stripe
- Profile management

### Staff/Admin Features
- Analytics dashboard with operational metrics
- Guest and booking management
- Service request tracking and completion
- Feedback monitoring with sentiment trends
- Real-time WebSocket notifications

### AI Features
- Hotel concierge chatbot powered by LLM (Groq/Gemini)
- Automatic sentiment analysis of guest feedback
- RAG-based knowledge base for hotel information
- Multi-LLM fallback support

---

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings | List bookings |
| PATCH | /api/bookings/:id | Update booking |
| DELETE | /api/bookings/:id | Cancel booking |

### Service Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/requests | Create request |
| GET | /api/requests | List requests |
| PATCH | /api/requests/:id | Update status |

### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/feedback | Submit feedback |
| GET | /api/feedback | List feedback |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/intent | Create payment intent |
| POST | /api/payments/confirm | Confirm payment |
| GET | /api/payments | List payments |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/analytics/dashboard | Dashboard metrics |
| GET | /api/analytics/requests | Request statistics |
| GET | /api/analytics/revenue | Revenue data |

### AI Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /ai/chat | AI concierge chat |
| POST | /ai/sentiment | Analyze sentiment |
| POST | /ai/rag | Knowledge base query |

### WebSocket Events

```mermaid
sequenceDiagram
    Client->>+Server: connect()
    Server-->>-Client: connection established
    
    Client->>+Server: join(userId)
    
    Note over Server: Booking confirmed
    Server->>Client: booking-confirmed event
    
    Note over Server: Request updated
    Server->>Client: request-updated event
    
    Note over Server: Payment received
    Server->>Client: payment-received event
    
    Client->>Server: disconnect()
```

---

## Database Schema

```mermaid
erDiagram
    User ||--o{ Booking : "places"
    User ||--o{ ServiceRequest : "submits"
    User ||--o{ Feedback : "provides"
    User ||--o{ Payment : "makes"
    User ||--o{ Notification : "receives"
    Booking ||--|| Payment : "has"
    Booking {
        uuid id
        string status
        date checkIn
        date checkOut
        float totalPrice
        string roomType
    }

    ServiceRequest {
        uuid id
        string type
        string status
        text description
        datetime createdAt
    }

    Feedback {
        uuid id
        int rating
        text comment
        string sentiment
        datetime createdAt
    }

    User {
        uuid id
        string email
        string password
        string name
        string role
    }

    Payment {
        uuid id
        string stripeId
        float amount
        string status
        datetime createdAt
    }

    Notification {
        uuid id
        string type
        string message
        boolean read
        datetime createdAt
    }
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- PostgreSQL database
- Stripe account
- Groq API key
- Google Gemini API key

### Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### AI Services Setup

```bash
cd ai-services
pip install -r requirements.txt
python app.py
```

---

## Environment Variables

### Backend (backend/.env)

```
DATABASE_URL=postgresql://user:password@host:5432/db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRY=7d
NODE_ENV=development
BACKEND_PORT=3000
STRIPE_SECRET_KEY=your-stripe-key
EMAIL_USER=gmail-address
EMAIL_PASS=gmail-app-password
```

### Frontend (frontend/.env)

```
REACT_APP_API_URL=http://localhost:3000/api
```

### AI Services (ai-services/.env)

```
GROQ_API_KEY=your-groq-api-key
GEMINI_API_KEY=your-gemini-key
DATABASE_URL=postgresql://...
```

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | Admin@123 |
| Staff | staff@hotel.com | Staff@123 |
| Guest | guest@hotel.com | Guest@123 |
