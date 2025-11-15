export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'patient' | 'therapist';
  isEmailVerified: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  age?: number;
  gender?: string;
  mentalHealthConcerns?: string[];
  emergencyContact?: string;
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'patient' | 'therapist';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}