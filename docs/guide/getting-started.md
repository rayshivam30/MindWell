# Getting Started

This guide will help you set up the MindWell mental health app on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - `npm install -g pnpm`
- **React Native development environment**
  - For iOS: Xcode (macOS only)
  - For Android: Android Studio
- **Redis** server
- **Firebase** project

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mental-health-app

# Install all dependencies
pnpm install-all
```

### 2. Backend Setup

```bash
cd backend

# Copy environment configuration
cp .env.example .env

# Edit .env with your configuration
nano .env
```

Required environment variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key

# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Email Configuration
ETHEREAL_EMAIL=your-ethereal-email@ethereal.email
ETHEREAL_PASSWORD=your-ethereal-password
```

### 3. Start Services

```bash
# Terminal 1: Start Redis
redis-server

# Terminal 2: Start Backend
cd backend
pnpm run dev

# Terminal 3: Start Frontend
pnpm start
# Then press 'a' for Android or 'i' for iOS
```

## Development Workflow

### Running Tests

```bash
# Frontend tests
pnpm test

# Backend tests
cd backend
pnpm test

# Run tests with coverage
pnpm test:coverage
```

### Code Quality

```bash
# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix

# Type checking
pnpm type-check
```

### Documentation

```bash
# Start documentation server
cd docs
pnpm dev

# Build documentation
pnpm build
```

## Project Structure

```
mental-health-app/
├── src/                          # React Native frontend
│   ├── screens/                  # Screen components
│   │   ├── auth/                # Authentication screens
│   │   └── main/                # Main app screens
│   ├── navigation/              # Navigation configuration
│   ├── store/                   # Redux store and slices
│   ├── services/                # API services
│   ├── types/                   # TypeScript types
│   ├── theme/                   # UI theme
│   └── __tests__/               # Frontend tests
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── config/              # Configuration
│   │   ├── types/               # TypeScript types
│   │   └── __tests__/           # Backend tests
│   └── logs/                    # Application logs
├── docs/                        # Documentation
└── package.json                 # Root package.json
```

## Available Scripts

### Root Level

- `pnpm start` - Start React Native development server
- `pnpm test` - Run frontend tests
- `pnpm lint` - Lint frontend code
- `pnpm backend` - Start backend development server
- `pnpm install-all` - Install all dependencies

### Backend

- `pnpm dev` - Start backend in development mode
- `pnpm build` - Build backend for production
- `pnpm start` - Start production backend
- `pnpm test` - Run backend tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage

### Documentation

- `pnpm dev` - Start documentation development server
- `pnpm build` - Build documentation for production
- `pnpm preview` - Preview built documentation

## Next Steps

Now that you have the app running locally, you can:

1. **Explore the Authentication Flow** - Try registering a new account, verifying email, and logging in
2. **Review the Code** - Check out the well-structured codebase with TypeScript
3. **Run Tests** - Execute the comprehensive test suite
4. **Read the Documentation** - Explore the detailed guides and API documentation
5. **Start Building** - Add new features like mood tracking or journaling

## Troubleshooting

### Common Issues

**Redis Connection Error**
```bash
# Make sure Redis is running
redis-server

# Check if Redis is accessible
redis-cli ping
```

**Firebase Configuration Error**
- Ensure your Firebase service account key is properly formatted JSON
- Verify your Firebase project ID and database URL are correct

**React Native Build Issues**
```bash
# Clean React Native cache
npx react-native start --reset-cache

# For iOS
cd ios && pod install

# For Android
cd android && ./gradlew clean
```

**Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in backend/.env
PORT=3001
```

## Getting Help

- Check the [API Documentation](/api/authentication) for backend endpoints
- Review the [Architecture Guide](/guide/architecture/overview) for system design
- Look at the test files for usage examples
- Create an issue on GitHub for bugs or feature requests

Ready to dive deeper? Check out the [Architecture Overview](/guide/architecture/overview) next.