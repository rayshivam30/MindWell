// Mock the authAPI first
jest.mock('../../services/authAPI', () => ({
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

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { 
  loginUser, 
  signupUser, 
  logoutUser, 
  clearError, 
  setUser, 
  clearAuth 
} from '../../../store/slices/authSlice';

describe('authSlice', () => {
  let store: any;

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

  describe('reducers', () => {
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
      expect(store.getState().auth.isAuthenticated).toBe(true);

      // Then clear it
      store.dispatch(clearAuth());
      const state = store.getState().auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('async thunks', () => {
    it('should handle login pending state', () => {
      store.dispatch({ type: loginUser.pending.type });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login fulfilled state', () => {
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

      store.dispatch({ type: loginUser.fulfilled.type, payload: mockResponse });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.token);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle login rejected state', () => {
      store.dispatch({ type: loginUser.rejected.type, payload: 'Login failed' });
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Login failed');
    });
  });
});