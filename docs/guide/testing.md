# Testing Guide

This guide covers the comprehensive testing strategy implemented in the MindWell app, including unit tests, integration tests, and testing best practices.

## Testing Philosophy

Our testing approach follows the testing pyramid:

- **Unit Tests (70%)** - Test individual functions and components in isolation
- **Integration Tests (20%)** - Test how different parts work together
- **End-to-End Tests (10%)** - Test complete user workflows

## Test Structure

### Frontend Tests

Located in `src/__tests__/` with the following structure:

```
src/__tests__/
├── screens/
│   └── auth/
│       ├── WelcomeScreen.test.tsx
│       ├── LoginScreen.test.tsx
│       └── SignupScreen.test.tsx
├── store/
│   └── slices/
│       └── authSlice.test.ts
├── services/
│   └── authAPI.test.ts
└── components/
    └── [component tests]
```

### Backend Tests

Located in `backend/src/__tests__/` with the following structure:

```
backend/src/__tests__/
├── controllers/
│   └── authController.test.ts
├── middleware/
│   └── authMiddleware.test.ts
├── integration/
│   └── auth.integration.test.ts
└── utils/
    └── [utility tests]
```

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test WelcomeScreen.test.tsx

# Run tests matching pattern
pnpm test --testNamePattern="should render"
```

### Backend Tests

```bash
cd backend

# Run all backend tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run only integration tests
pnpm test:integration

# Run specific test file
pnpm test authController.test.ts
```

## Test Configuration

### Frontend Jest Configuration

```json
{
  "preset": "react-native",
  "setupFilesAfterEnv": ["<rootDir>/src/test/setup.ts"],
  "testMatch": [
    "**/__tests__/**/*.(ts|tsx|js)",
    "**/*.(test|spec).(ts|tsx|js)"
  ],
  "collectCoverageFrom": [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**/*"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

### Backend Jest Configuration

```json
{
  "preset": "ts-jest",
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/src/test/setup.ts"],
  "coverageThreshold": {
    "global": {
      "branches": 75,
      "functions": 75,
      "lines": 75,
      "statements": 75
    }
  }
}
```

## Writing Tests

### Component Testing

Example of testing a React Native screen:

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { store } from '../../store/store';
import LoginScreen from '../../screens/auth/LoginScreen';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('LoginScreen', () => {
  it('should render login form', () => {
    const { getByLabelText, getByText } = renderWithProviders(<LoginScreen />);
    
    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('should show validation errors', async () => {
    const { getByText, getByLabelText } = renderWithProviders(<LoginScreen />);
    
    const signInButton = getByText('Sign In');
    fireEvent.press(signInButton);

    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
    });
  });
});
```

### Redux Testing

Example of testing Redux slices:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser, clearError } from '../../store/slices/authSlice';

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
  });

  it('should handle login success', () => {
    const mockResponse = {
      user: { id: '1', email: 'test@example.com' },
      token: 'mock-token',
    };

    store.dispatch({ 
      type: loginUser.fulfilled.type, 
      payload: mockResponse 
    });

    const state = store.getState().auth;
    expect(state.user).toEqual(mockResponse.user);
    expect(state.isAuthenticated).toBe(true);
  });
});
```

### API Testing

Example of testing API services:

```typescript
import axios from 'axios';
import { authAPI } from '../services/authAPI';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('authAPI', () => {
  it('should make login request', async () => {
    const mockResponse = { data: { token: 'mock-token' } };
    mockedAxios.post.mockResolvedValue(mockResponse);

    const result = await authAPI.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result).toEqual(mockResponse.data);
  });
});
```

### Backend Controller Testing

Example of testing Express controllers:

```typescript
import request from 'supertest';
import express from 'express';
import { register } from '../controllers/authController';

const app = express();
app.use(express.json());
app.post('/register', register);

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      userType: 'patient',
    };

    const response = await request(app)
      .post('/register')
      .send(userData)
      .expect(201);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
  });
});
```

### Integration Testing

Example of testing complete API flows:

```typescript
import request from 'supertest';
import app from '../app';

describe('Authentication Flow', () => {
  it('should complete signup and login flow', async () => {
    // 1. Register user
    const signupResponse = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Integration Test',
        email: 'integration@test.com',
        password: 'Password123!',
        userType: 'patient',
      });

    expect(signupResponse.status).toBe(201);
    const { token } = signupResponse.body;

    // 2. Verify email
    await request(app)
      .post('/api/auth/verify-email')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: '123456' });

    // 3. Login
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'integration@test.com',
        password: 'Password123!',
      });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.user.isEmailVerified).toBe(true);
  });
});
```

## Mocking Strategies

### React Native Mocks

```typescript
// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock React Navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock Keychain
jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(() => Promise.resolve()),
  getInternetCredentials: jest.fn(() => Promise.resolve({ username: 'test', password: 'test' })),
}));
```

### Backend Mocks

```typescript
// Mock Firebase
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(),
      })),
    })),
  })),
}));

// Mock Redis
jest.mock('../config/redis', () => ({
  redisUtils: {
    setSession: jest.fn(),
    getSession: jest.fn(),
    deleteSession: jest.fn(),
  },
}));
```

## Coverage Reports

### Viewing Coverage

```bash
# Generate coverage report
pnpm test:coverage

# Open coverage report in browser
open coverage/lcov-report/index.html
```

### Coverage Thresholds

We maintain high coverage standards:

- **Frontend**: 70% minimum coverage
- **Backend**: 75% minimum coverage
- **Critical paths**: 90%+ coverage required

### Coverage Exclusions

Files excluded from coverage:

- Type definition files (`*.d.ts`)
- Test setup files
- Configuration files
- Generated files

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
describe('Component/Function', () => {
  it('should do something when condition', () => {
    // Arrange
    const input = 'test input';
    const expected = 'expected output';

    // Act
    const result = functionUnderTest(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

### 2. Descriptive Test Names

```typescript
// ❌ Bad
it('should work', () => {});

// ✅ Good
it('should return validation error when email is invalid', () => {});
```

### 3. Test One Thing at a Time

```typescript
// ❌ Bad - Testing multiple things
it('should handle user registration and login', () => {
  // Tests both registration AND login
});

// ✅ Good - Separate tests
it('should register user successfully', () => {});
it('should login user with valid credentials', () => {});
```

### 4. Use Proper Assertions

```typescript
// ❌ Bad
expect(result).toBeTruthy();

// ✅ Good
expect(result).toBe('expected value');
expect(result).toEqual({ id: 1, name: 'test' });
```

### 5. Clean Up After Tests

```typescript
afterEach(() => {
  jest.clearAllMocks();
  // Clean up any test data
});
```

## Continuous Integration

### GitHub Actions

Our CI pipeline runs tests automatically:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: pnpm install
      - run: pnpm test:coverage
      - run: cd backend && pnpm test:coverage
```

### Quality Gates

Tests must pass before:
- Merging pull requests
- Deploying to staging
- Releasing to production

## Debugging Tests

### Common Issues

**Tests timing out:**
```typescript
// Increase timeout for async operations
jest.setTimeout(10000);
```

**Mock not working:**
```typescript
// Ensure mocks are cleared between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

**React Native component not rendering:**
```typescript
// Check if all required providers are wrapped
const renderWithProviders = (component) => (
  <Provider store={store}>
    <PaperProvider>
      {component}
    </PaperProvider>
  </Provider>
);
```

### Debugging Tools

```bash
# Run tests with verbose output
pnpm test --verbose

# Run specific test file
pnpm test LoginScreen.test.tsx

# Debug with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Next Steps

- Set up end-to-end testing with Detox
- Add visual regression testing
- Implement performance testing
- Set up automated accessibility testing

For more information, see:
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)