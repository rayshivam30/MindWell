import axios from 'axios';
import { authAPI } from '../../services/authAPI';
import { LoginCredentials, SignupData } from '../../types/auth';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

describe('authAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should make POST request to /auth/login', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            userType: 'patient',
            isEmailVerified: true,
          },
          token: 'mock-token',
          message: 'Login successful',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.login(credentials);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', credentials);
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle login error', async () => {
      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockError = {
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      };

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(authAPI.login(credentials)).rejects.toEqual(mockError);
    });
  });

  describe('signup', () => {
    it('should make POST request to /auth/signup', async () => {
      const signupData: SignupData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        userType: 'patient',
      };

      const mockResponse = {
        data: {
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            userType: 'patient',
            isEmailVerified: false,
          },
          token: 'mock-token',
          message: 'Account created successfully',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.signup(signupData);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/signup', signupData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('logout', () => {
    it('should make POST request to /auth/logout', async () => {
      mockAxiosInstance.post.mockResolvedValue({ data: {} });

      await authAPI.logout();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('verifyEmail', () => {
    it('should make POST request to /auth/verify-email', async () => {
      const verificationCode = '123456';
      const mockResponse = {
        data: {
          user: {
            id: '1',
            isEmailVerified: true,
          },
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.verifyEmail(verificationCode);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/verify-email', {
        code: verificationCode,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('forgotPassword', () => {
    it('should make POST request to /auth/forgot-password', async () => {
      const email = 'test@example.com';
      const mockResponse = {
        data: {
          message: 'Password reset email sent',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.forgotPassword(email);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/forgot-password', { email });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('resetPassword', () => {
    it('should make POST request to /auth/reset-password', async () => {
      const token = 'reset-token';
      const newPassword = 'NewPassword123!';
      const mockResponse = {
        data: {
          message: 'Password reset successful',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.resetPassword(token, newPassword);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/reset-password', {
        token,
        newPassword,
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('continueAsGuest', () => {
    it('should make POST request to /auth/guest', async () => {
      const mockResponse = {
        data: {
          guestToken: 'guest-token',
        },
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await authAPI.continueAsGuest();

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/guest');
      expect(result).toEqual(mockResponse.data);
    });
  });
});