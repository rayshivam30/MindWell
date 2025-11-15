---
layout: home

hero:
  name: "MindWell"
  text: "Mental Health & Wellness Companion"
  tagline: "Complete documentation for building a production-ready mental health application"
  image:
    src: /hero-image.svg
    alt: MindWell
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/your-username/mental-health-app

features:
  - icon: 🔐
    title: Secure Authentication
    details: JWT-based authentication with email verification, password reset, and session management using Redis.
  
  - icon: 📱
    title: Cross-Platform Mobile
    details: Built with React Native and TypeScript for iOS and Android with a consistent user experience.
  
  - icon: 🏗️
    title: Scalable Architecture
    details: Production-ready backend with Express.js, Firebase Firestore, and comprehensive error handling.
  
  - icon: 🧪
    title: Comprehensive Testing
    details: Unit tests, integration tests, and end-to-end testing with Jest and React Native Testing Library.
  
  - icon: 📚
    title: Complete Documentation
    details: Detailed guides, API documentation, and examples for every feature and component.
  
  - icon: 🚀
    title: DevOps Ready
    details: Docker containerization, CI/CD pipelines, and deployment configurations for production.
---

## Quick Overview

MindWell is a comprehensive mental health and wellness companion app designed to help users track their mood, journal their thoughts, meditate, and connect with mental health professionals. This documentation covers everything from initial setup to advanced features.

### Key Features

- **Authentication Flow**: Complete user registration, login, email verification, and password reset
- **User Types**: Support for both patients and therapists with role-based access
- **Security**: Production-grade security with JWT tokens, password hashing, and rate limiting
- **Real-time Features**: Built-in support for real-time communication and notifications
- **Scalable Backend**: Firebase Firestore for data storage and Redis for session management

### Technology Stack

**Frontend**
- React Native with TypeScript
- Redux Toolkit for state management
- React Navigation for routing
- React Native Paper for UI components

**Backend**
- Node.js with Express and TypeScript
- Firebase Firestore for database
- Redis for caching and sessions
- JWT for authentication

**DevOps**
- Docker for containerization
- pnpm for package management
- Jest for testing
- ESLint and Prettier for code quality

## What's Included

This project includes:

- ✅ **Complete Authentication System** - Registration, login, email verification, password reset
- ✅ **User Management** - Profile customization, user types (patient/therapist)
- ✅ **Security Features** - JWT tokens, password hashing, rate limiting, input validation
- ✅ **Testing Suite** - Unit tests, integration tests, and test utilities
- ✅ **Documentation** - Comprehensive guides and API documentation
- ✅ **Development Tools** - ESLint, Prettier, TypeScript configurations

## Next Steps

Ready to build the next features:

- 🔄 **Mood Tracking** - Daily mood check-ins with analytics
- 📝 **Journaling** - Rich text journaling with AI sentiment analysis
- 🧘‍♀️ **Meditation** - Guided meditation library with progress tracking
- 🤖 **AI Therapy Chat** - Conversational AI for mental health support
- 👥 **Community Features** - Forums and peer support groups
- 📹 **Video Therapy** - Real-time video sessions with therapists

## Getting Started

```bash
# Clone the repository
git clone <repository-url>
cd mental-health-app

# Install dependencies with pnpm
pnpm install-all

# Start the development servers
pnpm run backend  # Start backend server
pnpm start        # Start React Native app
```

[Get Started →](/guide/getting-started)