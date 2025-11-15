#!/bin/bash

# MindWell Setup Script
echo "🧠 Setting up MindWell Mental Health App..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
pnpm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && pnpm install && cd ..

# Install docs dependencies
echo "Installing documentation dependencies..."
cd docs && pnpm install && cd ..

# Create backend .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "⚙️ Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Please edit backend/.env with your configuration"
fi

# Create logs directory
mkdir -p backend/logs

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your Firebase and Redis configuration"
echo "2. Start Redis server: redis-server"
echo "3. Start backend: cd backend && pnpm dev"
echo "4. Start frontend: pnpm start"
echo "5. View docs: cd docs && pnpm dev"
echo ""
echo "For more information, see: README.md"