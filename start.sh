#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Smart Hospitality Services..."

# 1. Database Migrations (Backend)
if [ -n "$DATABASE_URL" ]; then
  echo "📡 Running database migrations..."
  cd /app/backend
  if ! npx prisma migrate deploy; then
    echo "⚠️ prisma migrate deploy failed. Attempting prisma db push..."
    if ! npx prisma db push; then
      echo "⚠️ Prisma schema sync failed. Continuing startup so service can boot."
    fi
  fi
fi

# 2. Start AI Services in background
echo "🤖 Starting AI Services on port 8001..."
cd /app/ai-services
# Using uvicorn to run the FastAPI app
python -m uvicorn app:app --host 0.0.0.0 --port 8001 &

# 3. Start Backend in foreground
echo "⚙️ Starting Backend on port $PORT..."
cd /app/backend
# Set the internal AI URL for the proxy
export AI_SERVICE_URL="http://localhost:8001"
# Start the node server (Render provides $PORT, we use it for the backend)
exec node src/index.js
