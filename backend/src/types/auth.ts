export interface User {
  id: string;
  email: string;
  name: string;
  userType: 'patient' | 'therapist';
  isEmailVerified: boolean;
  profile?: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  age?: number;
  gender?: string;
  mentalHealthConcerns?: string[];
  emergencyContact?: string;
  profilePicture?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'patient' | 'therapist';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
  message: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  userType: 'patient' | 'therapist';
  iat?: number;
  exp?: number;
}

export interface VerificationCode {
  userId: string;
  code: string;
  type: 'email_verification' | 'password_reset';
  expiresAt: Date;
  createdAt: Date;
}