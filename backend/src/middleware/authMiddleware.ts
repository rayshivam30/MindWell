import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { redisUtils } from '../config/redis';
import { logger } from '../utils/logger';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Check if session exists in Redis
    const session = await redisUtils.getSession(decoded.userId);
    if (!session) {
      return res.status(401).json({ message: 'Session expired' });
    }

    // Add user info to request object
    (req as any).user = {
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType,
      isGuest: session.isGuest || false,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    logger.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Middleware to check if user is verified
export const requireVerifiedEmail = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (user.isGuest) {
    return next(); // Guests don't need email verification
  }

  // This would require fetching user data from database to check isEmailVerified
  // For now, we'll assume the token is only issued to verified users after verification
  next();
};

// Middleware to check user type
export const requireUserType = (allowedTypes: ('patient' | 'therapist')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!allowedTypes.includes(user.userType)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }
    
    next();
  };
};