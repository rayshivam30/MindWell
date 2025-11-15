import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { redisUtils } from '../config/redis';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
    userType: 'patient' | 'therapist';
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisUtils.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      res.status(401).json({ message: 'Token has been invalidated.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const requireUserType = (userType: 'patient' | 'therapist') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    if (req.user.userType !== userType) {
      res.status(403).json({ message: `Access denied. ${userType} role required.` });
      return;
    }

    next();
  };
};