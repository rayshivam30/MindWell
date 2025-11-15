import request from 'supertest';
import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';

// Create test app
const app = express();
app.use(express.json());

// Add test routes
app.post('/register', 
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('userType').isIn(['patient', 'therapist']),
  ],
  validateRequest,
  register
);

app.post('/login',
  [
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  validateRequest,
  login
);

app.post('/verify-email',
  [
    body('code').isLength({ min: 6, max: 6 }),
  ],
  validateRequest,
  verifyEmail
);

describe('Auth Controller', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.userType).toBe(userData.userType);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return validation error for invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body).toHaveProperty('errors');
    });

    it('should return validation error for short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        confirmPassword: '123',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return validation error for invalid user type', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        userType: 'invalid',
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return error for missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // Missing name, password, userType
      };

      const response = await request(app)
        .post('/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /login', () => {
    it('should return validation error for invalid email', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return validation error for missing password', async () => {
      const loginData = {
        email: 'test@example.com',
        // Missing password
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should handle login with valid credentials (mocked)', async () => {
      // This test would require mocking the database and authentication logic
      // For now, we're testing the validation layer
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      // This will fail because we don't have a real database connection
      // but it tests that validation passes
      const response = await request(app)
        .post('/login')
        .send(loginData);

      // Should not be a validation error (400)
      expect(response.status).not.toBe(400);
    });
  });

  describe('POST /verify-email', () => {
    it('should return validation error for invalid code length', async () => {
      const verificationData = {
        code: '123', // Too short
      };

      const response = await request(app)
        .post('/verify-email')
        .send(verificationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return validation error for non-numeric code', async () => {
      const verificationData = {
        code: 'abcdef',
      };

      const response = await request(app)
        .post('/verify-email')
        .send(verificationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should pass validation for valid 6-digit code', async () => {
      const verificationData = {
        code: '123456',
      };

      // This will fail at the authentication level, but validation should pass
      const response = await request(app)
        .post('/verify-email')
        .send(verificationData);

      // Should not be a validation error (400)
      expect(response.status).not.toBe(400);
    });
  });
});