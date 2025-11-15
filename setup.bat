@echo off
REM MindWell Setup Script for Windows
echo 🧠 Setting up MindWell Mental Health App...

REM Check if pnpm is installed
pnpm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ pnpm is not installed. Installing pnpm...
    npm install -g pnpm
)

echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing root dependencies...
pnpm install

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
pnpm install
cd ..

REM Install docs dependencies
echo Installing documentation dependencies...
cd docs
pnpm install
cd ..

REM Create backend .env file if it doesn't exist
if not exist "backend\.env" (
    echo ⚙️ Creating backend .env file...
    copy "backend\.env.example" "backend\.env"
    echo ✅ Please edit backend\.env with your configuration
)

REM Create logs directory
if not exist "backend\logs" mkdir "backend\logs"

echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your Firebase and Redis configuration
echo 2. Start Redis server: redis-server
echo 3. Start backend: cd backend ^&^& pnpm dev
echo 4. Start frontend: pnpm start
echo 5. View docs: cd docs ^&^& pnpm dev
echo.
echo For more information, see: README.md