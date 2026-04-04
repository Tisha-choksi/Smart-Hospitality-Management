@echo off
REM ==========================================
REM FIX SCRIPT FOR WINDOWS SETUP ISSUES
REM ==========================================
REM Run this to fix the setup errors

setlocal enabledelayedexpansion

echo.
echo 🔧 Fixing Smart Hospitality Setup Issues...
echo ==================================================
echo.

REM ==========================================
REM FIX 1: BACKEND PACKAGE.JSON
REM ==========================================
echo [1/3] Fixing backend package.json...

REM Delete corrupted file
if exist backend\package.json (
  del backend\package.json
  echo ✓ Removed corrupted package.json
)

REM Create new package.json
(
  echo {
  echo   "name": "smart-hospitality-backend",
  echo   "version": "1.0.0",
  echo   "description": "Express.js backend for Smart Hospitality Management",
  echo   "private": true,
  echo   "main": "dist/index.js",
  echo   "type": "commonjs",
  echo   "scripts": {
  echo     "dev": "tsx watch src/index.ts",
  echo     "build": "tsc",
  echo     "start": "node dist/index.js",
  echo     "lint": "eslint src --ext .ts,.tsx",
  echo     "format:check": "prettier --check \"src/**/*.ts\"",
  echo     "format": "prettier --write \"src/**/*.ts\"",
  echo     "test": "jest",
  echo     "test:watch": "jest --watch",
  echo     "db:migrate": "prisma migrate dev",
  echo     "db:seed": "node dist/prisma/seed.js",
  echo     "db:reset": "prisma migrate reset"
  echo   },
  echo   "dependencies": {
  echo     "express": "^4.18.2",
  echo     "cors": "^2.8.5",
  echo     "dotenv": "^16.3.1",
  echo     "@prisma/client": "^5.7.0",
  echo     "axios": "^1.6.0",
  echo     "@supabase/supabase-js": "^2.39.0",
  echo     "jsonwebtoken": "^9.1.2",
  echo     "bcryptjs": "^2.4.3",
  echo     "morgan": "^1.10.0",
  echo     "helmet": "^7.1.0",
  echo     "express-validator": "^7.0.0",
  echo     "uuid": "^9.0.1"
  echo   },
  echo   "devDependencies": {
  echo     "@types/express": "^4.17.21",
  echo     "@types/node": "^20",
  echo     "@types/cors": "^2.8.17",
  echo     "@types/jsonwebtoken": "^9.0.7",
  echo     "@types/bcryptjs": "^2.4.6",
  echo     "typescript": "^5",
  echo     "tsx": "^4.7.0",
  echo     "ts-node": "^10.9.2",
  echo     "prisma": "^5.7.0",
  echo     "eslint": "^8",
  echo     "@typescript-eslint/eslint-plugin": "^6.17.0",
  echo     "@typescript-eslint/parser": "^6.17.0",
  echo     "prettier": "^3.0.0",
  echo     "jest": "^29.7.0",
  echo     "@types/jest": "^29.5.11",
  echo     "ts-jest": "^29.1.1",
  echo     "supertest": "^6.3.3",
  echo     "@types/supertest": "^6.0.2"
  echo   }
  echo }
) > backend\package.json

echo ✓ Created new backend package.json
echo.

REM ==========================================
REM FIX 2: INSTALL BACKEND DEPENDENCIES
REM ==========================================
echo [2/3] Installing backend dependencies...
cd backend
call npm install
cd ..
echo ✓ Backend dependencies installed
echo.

REM ==========================================
REM FIX 3: PYTHON SETUP
REM ==========================================
echo [3/3] Checking Python installation...
python --version >nul 2>&1

if %errorlevel% neq 0 (
  echo.
  echo ⚠️  Python is not installed or not in PATH
  echo.
  echo 📥 To fix this:
  echo    1. Download Python from: https://www.python.org/downloads/
  echo    2. During installation, CHECK "Add Python to PATH"
  echo    3. Click "Install Now"
  echo    4. After installation, restart this command prompt
  echo    5. Run this script again
  echo.
  pause
  exit /b 1
) else (
  echo ✓ Python is installed
  echo.
  
  REM Create venv
  echo Creating Python virtual environment...
  cd ai-services
  
  if not exist venv (
    python -m venv venv
    echo ✓ Virtual environment created
  )
  
  REM Activate and install
  call venv\Scripts\activate.bat
  python -m pip install --upgrade pip
  pip install -r requirements.txt
  call venv\Scripts\deactivate.bat
  
  cd ..
  echo ✓ Python dependencies installed
)

echo.
echo ==========================================
echo ✅ All fixes completed!
echo ==========================================
echo.
echo 📝 Next steps:
echo.
echo 1. Edit .env with your API keys
echo.
echo 2. Setup database:
echo    cd backend
echo    npm run db:migrate
echo    npm run db:seed
echo    cd ..
echo.
echo 3. Start all services:
echo    npm run dev
echo.
echo Services will run at:
echo    - Frontend: http://localhost:3000
echo    - Backend: http://localhost:3000/api
echo    - AI Services: http://localhost:8001
echo.

pause