import { configureStore } from '@reduxjs/toolkit';
import authReducer, { 
  loginUser, 
  signupUser, 
  logoutUser, 
  clearError, 
  setUser, 
  clearAuth 
} from '../../store/slices/authSlice';
import { AuthState } from '../../types/auth';

// Mock the authAPI
jest.mock('../../../services/authAPI', () => ({
  authAPI: {
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
    verifyEmail: jest.fn(),
  },
}));

// Mock react-native-keychain
jest.mock('react-native-keychain', () => ({
  setInternetCredentials: jest.fn(() => Promise.resolve()),
  resetInternetCredentials: jest.fn(() => Promise.resolve()),
}));

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should clear error', () => {
      // First set an error
      store.dispatch({ type: 'auth/loginUser/rejected', payload: 'Test error' });
      expect(store.getState().auth.error).toBe('Test error');

      // Then clear it
      store.dispatch(clearError());
      expect(store.getState().auth.error).toBeNull();
    });

    it('should set user', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userType: 'patient' as const,
        isEmailVerified: true,
      };

      store.dispatch(setUser(mockUser));
      const state = store.getState().auth;

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should clear auth', () => {
      // First set some auth data
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userType: 'patient' as const,
        isEmailVerified: true,
      };
      store.dispatch(setUser(mockUser));

      // Then clear it
      store.dispatch(clearAuth());
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('async actions', () => {
    it('should handle loginUser pending', () => {
      store.dispatch({ type: loginUser.pending.type });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser fulfilled', () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          userType: 'patient' as const,
          isEmailVerified: true,
        },
        token: 'mock-token',
        message: 'Login successful',
      };

      store.dispatch({ 
        type: loginUser.fulfilled.type, 
        payload: mockResponse 
      });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle loginUser rejected', () => {
      const errorMessage = 'Invalid credentials';
      
      store.dispatch({ 
        type: loginUser.rejected.type, 
        payload: errorMessage 
      });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should handle signupUser fulfilled', () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          userType: 'patient' as const,
          isEmailVerified: false,
        },
        token: 'mock-token',
        message: 'Signup successful',
      };

      store.dispatch({ 
        type: signupUser.fulfilled.type, 
        payload: mockResponse 
      });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.token);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle logoutUser fulfilled', () => {
      // First set some auth data
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        userType: 'patient' as const,
        isEmailVerified: true,
      };
      store.dispatch(setUser(mockUser));

      // Then logout
      store.dispatch({ type: logoutUser.fulfilled.type });
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });
});