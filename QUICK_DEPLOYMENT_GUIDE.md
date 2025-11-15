# Quick Deployment Guide - Get MindWell Running

## 🚀 Step 1: Push to GitHub

### 1.1 Initialize Git Repository
```bash
# In your project root
git init
git add .
git commit -m "Initial commit: MindWell mental health app with full CI/CD"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `mental-health-app` or `mindwell-app`
3. Make it **Public** (for GitHub Pages to work free)
4. Don't initialize with README (you already have one)
5. Click "Create repository"

### 1.3 Push to GitHub
```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/mental-health-app.git
git branch -M main
git push -u origin main
```

## 🔧 Step 2: Configure GitHub Secrets

### 2.1 Go to Repository Settings
1. Go to your GitHub repository
2. Click "Settings" tab
3. Click "Secrets and variables" → "Actions"
4. Click "New repository secret"

### 2.2 Add Required Secrets (Minimum for Basic Deployment)
```bash
# Add these secrets one by one:

# 1. JWT Secret (Required)
Name: JWT_SECRET
Value: your-super-secure-jwt-secret-key-change-this-in-production

# 2. Firebase Service Account (Required)
Name: FIREBASE_SERVICE_ACCOUNT_KEY
Value: {"type":"service_account","project_id":"your-firebase-project-id","private_key_id":"..."}

# 3. Redis URL (For production - optional for now)
Name: REDIS_URL
Value: redis://localhost:6379

# 4. Slack Webhook (Optional - for notifications)
Name: SLACK_WEBHOOK_URL
Value: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### 2.3 Firebase Setup (If you don't have it)
```bash
# 1. Go to https://console.firebase.google.com/
# 2. Create new project: "mindwell-app"
# 3. Go to Project Settings → Service Accounts
# 4. Click "Generate new private key"
# 5. Copy the entire JSON content
# 6. Paste it as FIREBASE_SERVICE_ACCOUNT_KEY secret
```

## 🎯 Step 3: Simple Deployment Options

### Option A: GitHub Pages Only (Easiest)
```bash
# This will automatically deploy your documentation
# Just push to main branch and GitHub Actions will:
# 1. Run tests
# 2. Build documentation
# 3. Deploy docs to GitHub Pages

# Your docs will be available at:
# https://YOUR_USERNAME.github.io/mental-health-app/
```

### Option B: Backend on Railway (Free Tier)
```bash
# 1. Go to https://railway.app/
# 2. Sign up with GitHub
# 3. Click "New Project" → "Deploy from GitHub repo"
# 4. Select your mental-health-app repository
# 5. Select the backend folder
# 6. Add environment variables:
#    - NODE_ENV=production
#    - JWT_SECRET=your-jwt-secret
#    - FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-json
#    - REDIS_URL=redis://redis:6379 (Railway provides Redis)
# 7. Deploy!

# Your API will be available at:
# https://your-app-name.railway.app/
```

### Option C: Full Docker Deployment on Railway
```bash
# 1. Create railway.json in your root:
{
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "backend/Dockerfile"
  },
  "deploy": {
    "startCommand": "node dist/server.js",
    "healthcheckPath": "/health"
  }
}

# 2. Push to GitHub
# 3. Railway will auto-deploy using your Dockerfile
```

## 📱 Step 4: Mobile App (React Native)

### 4.1 Test Locally First
```bash
# Make sure it works locally
pnpm start
# Press 'a' for Android or 'i' for iOS
```

### 4.2 Deploy with Expo (Easiest)
```bash
# 1. Install Expo CLI
npm install -g @expo/cli

# 2. Create Expo account at https://expo.dev/

# 3. Login
expo login

# 4. Publish your app
expo publish

# 5. Share with others using Expo Go app
# They can scan QR code to test your app
```

## 🔍 Step 5: Monitor Your Deployment

### 5.1 Check GitHub Actions
1. Go to your repository
2. Click "Actions" tab
3. You should see CI pipeline running
4. Green checkmarks = everything working ✅
5. Red X = something failed ❌

### 5.2 Common Issues & Fixes

#### Tests Failing?
```bash
# Run tests locally first
pnpm test
cd backend && pnpm test

# Fix any failing tests before pushing
```

#### Build Failing?
```bash
# Check if everything builds locally
pnpm build:web
cd backend && pnpm build

# Fix build errors before pushing
```

#### Secrets Missing?
```bash
# Make sure you added all required secrets:
# - JWT_SECRET
# - FIREBASE_SERVICE_ACCOUNT_KEY
# Check GitHub repository → Settings → Secrets
```

## 🎯 Step 6: What Happens After Push

### Automatic CI/CD Pipeline Will:
1. **Run Tests** - Frontend and backend tests
2. **Check Code Quality** - ESLint, TypeScript, Prettier
3. **Security Scan** - Check for vulnerabilities
4. **Build Documentation** - Deploy to GitHub Pages
5. **Build Docker Images** - Ready for deployment
6. **Send Notifications** - Slack alerts (if configured)

### Your URLs Will Be:
```bash
# Documentation (automatically deployed)
https://YOUR_USERNAME.github.io/mental-health-app/

# Backend API (if deployed to Railway)
https://your-backend-app.railway.app/health

# Mobile App (via Expo)
Scan QR code in Expo Go app
```

## 🚀 Step 7: Add Features Later

### Once Everything is Deployed:
```bash
# 1. Create feature branch
git checkout -b feature/mood-tracking

# 2. Build your feature
# (Add mood tracking screens, API endpoints, etc.)

# 3. Push feature branch
git push origin feature/mood-tracking

# 4. Create Pull Request on GitHub
# 5. CI will test your changes automatically
# 6. Merge to main when ready
# 7. Auto-deploy to staging/production
```

## 🎯 Quick Start Commands

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit: MindWell app with CI/CD"
git remote add origin https://github.com/YOUR_USERNAME/mental-health-app.git
git push -u origin main

# 2. Add GitHub secrets (see Step 2.2 above)

# 3. Watch GitHub Actions deploy everything automatically!

# 4. Start building features:
git checkout -b feature/mood-tracking
# Build your next feature...
```

## 🆘 Need Help?

### If Something Goes Wrong:
1. Check GitHub Actions logs
2. Look at the error messages
3. Google the specific error
4. Check if all secrets are configured
5. Make sure Firebase project is set up correctly

### Common First-Time Issues:
- **Firebase not configured** → Set up Firebase project
- **Secrets missing** → Add JWT_SECRET and FIREBASE_SERVICE_ACCOUNT_KEY
- **Tests failing** → Run `pnpm test` locally first
- **Build failing** → Run `pnpm build` locally first

---

**Ready to deploy? Just follow Step 1 and push to GitHub! 🚀**