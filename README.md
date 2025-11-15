# MindWell - Mental Health & Wellness Companion App

A comprehensive mental health application built with React Native and Node.js, featuring mood tracking, journaling, AI therapy chat, meditation, and therapist connections.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- React Native development environment
- Redis server
- Firebase project

### Installation

#### Option 1: Automated Setup (Recommended)

```bash
git clone <repository-url>
cd mental-health-app

# For Unix/Linux/macOS
chmod +x setup.sh
./setup.sh

# For Windows
setup.bat
```

#### Option 2: Manual Installation

```bash
git clone <repository-url>
cd mental-health-app

# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
cd backend && pnpm install
cd ../docs && pnpm install
```

2. **Backend Setup**
```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# - Add your Firebase service account key
# - Configure Redis URL
# - Set JWT secret
# - Configure email service
```

3. **Start Redis** (if running locally)
```bash
redis-server
```

4. **Start Backend**
```bash
cd backend
pnpm run dev
```

5. **Start Frontend**
```bash
# In project root
pnpm start
# Then press 'a' for Android or 'i' for iOS
```

## 📱 Features Implemented

### ✅ Stage 1: Authentication Flow
- **Welcome Screen** - Landing page with login/signup/guest options
- **Login Flow** - Email/password authentication with validation
- **Signup Flow** - Account creation with user type selection
- **User Type Selection** - Choose between Patient or Therapist
- **Email Verification** - 6-digit code verification system
- **Profile Customization** - Optional profile setup
- **Forgot Password** - Password reset via email
- **Dashboard** - Personalized welcome screen

### 🔧 Technical Implementation
- **Frontend**: React Native with TypeScript, Redux Toolkit, React Navigation
- **Backend**: Node.js, Express, TypeScript, Firebase Firestore, Redis
- **Authentication**: JWT tokens with secure session management
- **Validation**: Comprehensive form validation with Formik + Yup
- **Security**: Password hashing, rate limiting, input sanitization
- **Email**: Verification and password reset emails

## 🏗️ Project Structure

```
mental-health-app/
├── src/                          # React Native frontend
│   ├── screens/auth/            # Authentication screens
│   ├── navigation/              # Navigation configuration
│   ├── store/                   # Redux store and slices
│   ├── services/                # API services
│   ├── types/                   # TypeScript types
│   └── theme/                   # UI theme configuration
├── backend/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Express middleware
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic services
│   │   ├── config/              # Database and service configs
│   │   └── types/               # TypeScript types
│   └── logs/                    # Application logs
└── docs/                        # Documentation
```

## 🔐 Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Redis-based session storage
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for specific origins
- **Security Headers**: Helmet.js security middleware

## 📊 Database Schema

### Firebase Firestore Collections

```javascript
// Users Collection
users/{userId} = {
  id: string,
  name: string,
  email: string,
  userType: 'patient' | 'therapist',
  isEmailVerified: boolean,
  profile?: {
    age?: number,
    gender?: string,
    mentalHealthConcerns?: string[],
    emergencyContact?: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Redis Keys
```
session:{userId}                    # User sessions
verification:email_verification:{userId}  # Email verification codes
verification:password_reset:{userId}      # Password reset tokens
ratelimit:{endpoint}:{ip}          # Rate limiting counters
```

## 🚀 Next Steps (Upcoming Features)

### Stage 2: Core Features
- [ ] Mood tracking with analytics
- [ ] Journaling with AI sentiment analysis
- [ ] Basic meditation library
- [ ] AI therapy chatbot integration

### Stage 3: Advanced Features
- [ ] Video therapy sessions
- [ ] Community forum
- [ ] Wearable device integration
- [ ] Advanced analytics and insights

## 🛠️ Development

### Running Tests
```bash
# Frontend tests
pnpm test

# Backend tests
cd backend && pnpm test

# All tests with coverage
pnpm test:coverage && cd backend && pnpm test:coverage
```

### Code Quality
```bash
# Linting
pnpm lint
pnpm lint:fix

# Type checking
pnpm type-check
```

### Documentation
```bash
# Start documentation server
cd docs && pnpm dev

# Build documentation
cd docs && pnpm build
```

### Building for Production
```bash
# Backend build
cd backend && pnpm build
```

### Simple Deployment
For simple deployment, you can use:
- **Backend**: Deploy to Railway, Render, or Heroku
- **Frontend**: Use Expo for mobile app distribution
- **Database**: Firebase Firestore (already configured)
- **Cache**: Redis Cloud or Railway Redis

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account"...}
REDIS_URL=redis://localhost:6379
SENDGRID_PASSWORD=your-api-key
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/guest` - Create guest session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in `/docs`
- Review the troubleshooting guide

---

**Built with ❤️ for mental health and wellness**