@echo off
REM ==========================================
REM Smart Hospitality Management Setup Script
REM ==========================================
REM Run from project root: setup.bat

setlocal enabledelayedexpansion

echo.
echo 🏨 Setting up Smart Hospitality Management System...
echo ==================================================
echo.

REM ==========================================
REM STEP 1: Create directory structure
REM ==========================================
echo [1/6] Creating directory structure...

mkdir frontend\app\auth
mkdir frontend\app\guest
mkdir frontend\app\staff
mkdir frontend\app\admin
mkdir frontend\components\ui
mkdir frontend\components\chat
mkdir frontend\components\dashboard
mkdir frontend\components\common
mkdir frontend\lib
mkdir frontend\public
mkdir frontend\styles
mkdir frontend\tests

mkdir backend\src\config
mkdir backend\src\middleware
mkdir backend\src\routes
mkdir backend\src\controllers
mkdir backend\src\services
mkdir backend\src\utils
mkdir backend\src\types
mkdir backend\src\db
mkdir backend\prisma
mkdir backend\tests\unit
mkdir backend\tests\integration

mkdir ai-services\app\routers
mkdir ai-services\app\services
mkdir ai-services\app\models
mkdir ai-services\app\utils
mkdir ai-services\tests
mkdir ai-services\chroma-data

mkdir .github\workflows

echo ✓ Directories created
echo.

REM ==========================================
REM STEP 2: Create .env file from example
REM ==========================================
echo [2/6] Setting up environment variables...

if not exist ".env" (
  copy ".env.example" ".env"
  echo ✓ Created .env from .env.example
  echo ⚠️  Please edit .env with your API keys
) else (
  echo ✓ .env already exists ^(not overwriting^)
)
echo.

REM ==========================================
REM STEP 3: Install frontend dependencies
REM ==========================================
echo [3/6] Installing frontend dependencies...

if exist "frontend\package.json" (
  cd frontend
  call npm install
  cd ..
  echo ✓ Frontend dependencies installed
) else (
  echo ⚠️  frontend\package.json not found
)
echo.

REM ==========================================
REM STEP 4: Install backend dependencies
REM ==========================================
echo [4/6] Installing backend dependencies...

if exist "backend\package.json" (
  cd backend
  call npm install
  cd ..
  echo ✓ Backend dependencies installed
) else (
  echo ⚠️  backend\package.json not found
)
echo.

REM ==========================================
REM STEP 5: Setup Python environment
REM ==========================================
echo [5/6] Setting up Python environment...

cd ai-services

if not exist "venv" (
  python -m venv venv
  echo ✓ Virtual environment created
) else (
  echo ✓ Virtual environment already exists
)

call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
call venv\Scripts\deactivate.bat

echo ✓ Python dependencies installed
cd ..
echo.

REM ==========================================
REM STEP 6: Initialize Git
REM ==========================================
echo [6/6] Initializing Git repository...

if not exist ".git" (
  call git init
  call git add .
  call git commit -m "Initial commit: Project scaffold"
  echo ✓ Git repository initialized
) else (
  echo ✓ Git repository already exists
)
echo.

REM ==========================================
REM STEP 7: Display next steps
REM ==========================================
echo.
echo ╔════════════════════════════════════════╗
echo ║   Setup Complete! 🎉                  ║
echo ╚════════════════════════════════════════╝
echo.

echo 📋 Next steps:
echo.
echo 1️⃣  Edit .env with your API keys:
echo    - SUPABASE_URL ^& keys ^(from supabase.com^)
echo    - GROQ_API_KEY ^(from console.groq.com^)
echo    - GEMINI_API_KEY ^(from aistudio.google.com^)
echo    - UPSTASH_REDIS_URL ^& token
echo    - RESEND_API_KEY
echo.

echo 2️⃣  Setup database ^(after configuring .env^):
echo    cd backend
echo    npm run db:migrate
echo    npm run db:seed
echo    cd ..
echo.

echo 3️⃣  Start development servers:
echo    npm run dev
echo.
echo    This will start:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:3000/api
echo    - AI Services: http://localhost:8001
echo    - API Docs: http://localhost:8001/docs
echo.

echo 4️⃣  Individual server startup:
echo    npm run dev:frontend    # Next.js frontend
echo    npm run dev:backend     # Express API
echo    npm run dev:ai          # FastAPI + Python
echo.

echo 📖 Documentation:
echo    - Root: README.md
echo    - Frontend: frontend\README.md
echo    - Backend: backend\README.md
echo    - AI Services: ai-services\README.md
echo.

echo 🔗 Useful links:
echo    - Supabase Console: https://supabase.com
echo    - Groq Console: https://console.groq.com
echo    - Vercel Dashboard: https://vercel.com
echo    - Render Dashboard: https://render.com
echo.

echo Happy coding! 🚀
echo.

pause