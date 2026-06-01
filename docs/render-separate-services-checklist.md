# Render Separate Services Deployment Checklist

## 1) Initial Codebase Analysis

- [ ] Confirm service boundaries:
  - Frontend: frontend/
  - Backend API: backend/
  - AI Service: ai_services/
- [ ] Verify backend routes and auth behavior.
- [ ] Verify AI endpoints and health endpoint.
- [ ] Verify frontend API client points to backend and AI base URLs.
- [ ] Identify monolithic deployment files at repo root:
  - Dockerfile
  - start.sh
  - render.yaml

Potential issues to resolve before split deployment:

- [ ] Mixed environment variables in a single root .env.
- [ ] CORS policy must include frontend origin on both backend and AI service.
- [ ] Remove backend AI proxy if frontend calls AI directly.
- [ ] Rotate all previously exposed secrets before production.

## 2) Environment Configuration

Backend environment variables:

- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] JWT_EXPIRY
- [ ] STRIPE_SECRET_KEY
- [ ] EMAIL_USER (optional)
- [ ] EMAIL_PASS (optional)
- [ ] CORS_ORIGINS
- [ ] NODE_ENV=production

AI environment variables:

- [ ] GROQ_API_KEY
- [ ] GOOGLE_API_KEY or GEMINI_API_KEY
- [ ] CORS_ORIGINS
- [ ] NODE_ENV=production

Frontend environment variables:

- [ ] REACT_APP_API_URL
- [ ] REACT_APP_AI_URL

Best practices:

- [ ] Keep secrets only in Render/Vercel environment settings.
- [ ] Use separate values for development and production.
- [ ] Never commit production secrets.

## 3) Dockerfile Review and Removal

- [ ] If deploying as separate Render services, monolithic root Docker setup is optional.
- [ ] Keep monolithic files only for fallback.
- [ ] After successful separate deployments, remove or archive:
  - Dockerfile
  - start.sh
  - render.yaml

Safe removal sequence:

1. [ ] Deploy backend service successfully.
2. [ ] Deploy AI service successfully.
3. [ ] Confirm frontend works with both live URLs.
4. [ ] Remove monolithic deployment files in a separate commit.

## 4) Refactoring for Service Separation

- [ ] Backend should not proxy AI service routes.
- [ ] Frontend should call backend URL and AI URL independently.
- [ ] Configure CORS separately on backend and AI.
- [ ] Keep independent health endpoints for both services.

Recommended communication model:

- Frontend -> Backend for core app APIs.
- Frontend -> AI service for AI endpoints.

## 5) Verification Steps (Local)

- [ ] Backend local check:
  - Start backend
  - Verify auth and CRUD APIs
- [ ] AI local check:
  - Start AI app
  - Verify /health, /ai/chat, /ai/sentiment/analyze
- [ ] Frontend local check:
  - Point to local backend and AI URLs
  - Test login, requests, feedback, AI chat

## 6) Manual Render Deployment Guide

Backend service:

- [ ] Create Render Web Service
- [ ] Root directory: backend
- [ ] Runtime: Node
- [ ] Build command: npm install && npx prisma generate
- [ ] Start command: npx prisma migrate deploy; node src/index.js
- [ ] Add backend env vars

AI service:

- [ ] Create Render Web Service
- [ ] Root directory: ai_services
- [ ] Runtime: Python
- [ ] Build command: pip install -r requirements.txt
- [ ] Start command: uvicorn app:app --host 0.0.0.0 --port $PORT
- [ ] Add AI env vars

Database:

- [ ] Create Render Postgres
- [ ] Set backend DATABASE_URL from Render Postgres connection string

## 7) Frontend Adjustment Preparation

- [ ] Update frontend/src/api/apiClient.js
- [ ] Set API base URL to backend service URL
- [ ] Set AI base URL to AI service URL
- [ ] Redeploy frontend after URL update

Post-deploy checks:

- [ ] Backend endpoint reachable
- [ ] AI health endpoint reachable
- [ ] Browser requests pass CORS from frontend origin
- [ ] End-to-end flows pass
