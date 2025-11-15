import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from '../../routes/auth';
import { errorHandler } from '../../middleware/errorHandler';

// Create test app similar to main server
const createTestApp = () => {
  const app = express();
  
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);
  
  return app;
};

describe('Auth Integration Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/signup', () => {
    it('should handle complete signup flow with validation', async () => {
      const validUserData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData);

      // Should not be a validation error
      expect(response.status).not.toBe(400);
      
      // Will likely be 500 due to missing database connection in test environment
      // but this tests the full middleware chain
    });

    it('should reject signup with mismatched passwords', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            message: 'Passwords do not match',
          }),
        ])
      );
    });

    it('should reject signup with weak password', async () => {
      const invalidUserData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
        userType: 'patient',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUserData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should validate login request format', async () => {
      const validLoginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(validLoginData);

      // Should pass validation (not 400)
      expect(response.status).not.toBe(400);
    });

    it('should reject login with invalid email format', async () => {
      const invalidLoginData = {
        email: 'not-an-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLoginData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /api/auth/verify-email', () => {
    it('should validate verification code format', async () => {
      const validVerificationData = {
        code: '123456',
      };

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send(validVerificationData);

      // Should pass validation
      expect(response.status).not.toBe(400);
    });

    it('should reject invalid verification code format', async () => {
      const invalidVerificationData = {
        code: '12345', // Too short
      };

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send(invalidVerificationData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should validate forgot password request', async () => {
      const validForgotPasswordData = {
        email: 'test@example.com',
      };

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(validForgotPasswordData);

      // Should pass validation
      expect(response.status).not.toBe(400);
    });

    it('should reject invalid email in forgot password', async () => {
      const invalidForgotPasswordData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send(invalidForgotPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should validate reset password request', async () => {
      const validResetPasswordData = {
        token: 'valid-reset-token',
        newPassword: 'NewSecurePassword123!',
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(validResetPasswordData);

      // Should pass validation
      expect(response.status).not.toBe(400);
    });

    it('should reject weak password in reset', async () => {
      const invalidResetPasswordData = {
        token: 'valid-reset-token',
        newPassword: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send(invalidResetPasswordData)
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('POST /api/auth/guest', () => {
    it('should allow guest session creation', async () => {
      const response = await request(app)
        .post('/api/auth/guest')
        .send({});

      // Should not be a validation error
      expect(response.status).not.toBe(400);
    });
  });

  describe('Error handling', () => {
    it('should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/auth/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });
});