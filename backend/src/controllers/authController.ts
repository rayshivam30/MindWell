import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getFirestore } from '../config/firebase';
import { redisUtils } from '../config/redis';
import { logger } from '../utils/logger';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
import { User, SignupRequest, LoginRequest, JWTPayload, AuthResponse } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateToken = (payload: JWTPayload): string => {
  const secret = JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  // @ts-ignore - JWT library type issue
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
};

// Generate verification code
const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, userType }: SignupRequest = req.body;
    const db = getFirestore();

    // Check if user already exists
    const existingUserQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!existingUserQuery.empty) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const user: User = {
      id: userId,
      name,
      email,
      userType,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save user to Firestore
    await db.collection('users').doc(userId).set({
      ...user,
      password: hashedPassword,
    });

    // Generate and store verification code
    const verificationCode = generateVerificationCode();
    await redisUtils.setVerificationCode(userId, verificationCode, 'email_verification', 600); // 10 minutes

    // Send verification email
    await sendVerificationEmail(email, name, verificationCode);

    // Generate JWT token
    const token = generateToken({
      userId,
      email,
      userType,
    });

    // Store session in Redis
    await redisUtils.setSession(userId, { userId, email, userType }, 86400 * 7); // 7 days

    const response: AuthResponse = {
      user: { ...user },
      token,
      message: 'Account created successfully. Please check your email for verification code.',
    };

    logger.info(`User registered: ${email}`);
    return res.status(201).json(response);

  } catch (error) {
    logger.error('Registration error:', error);
    return res.status(500).json({
      message: 'Internal server error during registration'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password }: LoginRequest = req.body;
    const db = getFirestore();

    // Find user by email
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const userDoc = userQuery.docs[0];
    if (!userDoc) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }
    const userData = userDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: userData.id,
      email: userData.email,
      userType: userData.userType,
    });

    // Store session in Redis
    await redisUtils.setSession(userData.id, {
      userId: userData.id,
      email: userData.email,
      userType: userData.userType,
    }, 86400 * 7); // 7 days

    // Remove password from response
    const { password: _, ...userWithoutPassword } = userData;

    const response: AuthResponse = {
      user: userWithoutPassword as User,
      token,
      message: 'Login successful',
    };

    logger.info(`User logged in: ${email}`);
    return res.json(response);

  } catch (error) {
    logger.error('Login error:', error);
    return res.status(500).json({
      message: 'Internal server error during login'
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as any).user.userId;

    // Remove session from Redis
    await redisUtils.deleteSession(userId);

    logger.info(`User logged out: ${userId}`);
    return res.json({ message: 'Logout successful' });

  } catch (error) {
    logger.error('Logout error:', error);
    return res.status(500).json({
      message: 'Internal server error during logout'
    });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const userId = decoded.userId;

    // Get stored verification code
    const storedCode = await redisUtils.getVerificationCode(userId, 'email_verification');
    
    if (!storedCode || storedCode !== code) {
      return res.status(400).json({
        message: 'Invalid or expired verification code'
      });
    }

    // Update user's email verification status
    const db = getFirestore();
    await db.collection('users').doc(userId).update({
      isEmailVerified: true,
      updatedAt: new Date(),
    });

    // Remove verification code
    await redisUtils.deleteVerificationCode(userId, 'email_verification');

    // Get updated user data
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const { password: _, ...userWithoutPassword } = userData!;

    logger.info(`Email verified for user: ${userId}`);
    return res.json({
      user: userWithoutPassword,
      message: 'Email verified successfully'
    });

  } catch (error) {
    logger.error('Email verification error:', error);
    return res.status(500).json({
      message: 'Internal server error during email verification'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;
    const db = getFirestore();

    // Find user by email
    const userQuery = await db.collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      // Don't reveal if email exists or not for security
      return res.json({
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    const userDoc = userQuery.docs[0];
    if (!userDoc) {
      return res.json({
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }
    const userData = userDoc.data();

    // Generate reset token
    const resetToken = uuidv4();
    await redisUtils.setVerificationCode(userData.id, resetToken, 'password_reset', 3600); // 1 hour

    // Send password reset email
    await sendPasswordResetEmail(email, userData.name, resetToken);

    logger.info(`Password reset requested for: ${email}`);
    return res.json({
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    return res.status(500).json({
      message: 'Internal server error during password reset request'
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;
    const db = getFirestore();

    // Find user by reset token (we need to search through Redis keys)
    // This is a simplified approach - in production, you might want to store user ID with the token
    const users = await db.collection('users').get();
    let targetUserId: string | null = null;

    for (const userDoc of users.docs) {
      const storedToken = await redisUtils.getVerificationCode(userDoc.id, 'password_reset');
      if (storedToken === token) {
        targetUserId = userDoc.id;
        break;
      }
    }

    if (!targetUserId) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user's password
    await db.collection('users').doc(targetUserId).update({
      password: hashedPassword,
      updatedAt: new Date(),
    });

    // Remove reset token
    await redisUtils.deleteVerificationCode(targetUserId, 'password_reset');

    // Invalidate all sessions for this user
    await redisUtils.deleteSession(targetUserId);

    logger.info(`Password reset completed for user: ${targetUserId}`);
    return res.json({
      message: 'Password reset successful. Please log in with your new password.'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    return res.status(500).json({
      message: 'Internal server error during password reset'
    });
  }
};

export const continueAsGuest = async (req: Request, res: Response) => {
  try {
    // Generate a guest token with limited permissions
    const guestId = `guest_${uuidv4()}`;
    const guestToken = generateToken({
      userId: guestId,
      email: 'guest@example.com',
      userType: 'patient',
    });

    // Store guest session with shorter TTL
    await redisUtils.setSession(guestId, {
      userId: guestId,
      email: 'guest@example.com',
      userType: 'patient',
      isGuest: true,
    }, 86400); // 24 hours

    logger.info(`Guest session created: ${guestId}`);
    return res.json({
      guestToken,
      message: 'Guest session created successfully'
    });

  } catch (error) {
    logger.error('Guest session error:', error);
    return res.status(500).json({
      message: 'Internal server error during guest session creation'
    });
  }
};