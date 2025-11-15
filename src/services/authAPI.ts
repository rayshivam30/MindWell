import axios from 'axios';
import { LoginCredentials, SignupData, AuthResponse } from '../types/auth';

// Use a more React Native friendly way to get the API URL
const API_BASE_URL = 'http://localhost:3000/api';

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  },

  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, { token });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, { token, password });
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`);
    return response.data;
  },

  continueAsGuest: async (): Promise<AuthResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/guest`);
    return response.data;
  },
};