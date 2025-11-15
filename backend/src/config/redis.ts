import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('error', (error) => {
  logger.error('Redis connection error:', error);
});

export const redisUtils = {
  setWithExpiry: async (key: string, value: string, expiryInSeconds: number): Promise<void> => {
    await redis.setex(key, expiryInSeconds, value);
  },

  get: async (key: string): Promise<string | null> => {
    return await redis.get(key);
  },

  delete: async (key: string): Promise<void> => {
    await redis.del(key);
  },

  exists: async (key: string): Promise<boolean> => {
    const result = await redis.exists(key);
    return result === 1;
  },

  // Session management
  setSession: async (userId: string, sessionData: any, expiryInSeconds: number): Promise<void> => {
    const key = `session:${userId}`;
    await redis.setex(key, expiryInSeconds, JSON.stringify(sessionData));
  },

  getSession: async (userId: string): Promise<any | null> => {
    const key = `session:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  deleteSession: async (userId: string): Promise<void> => {
    const key = `session:${userId}`;
    await redis.del(key);
  },

  // Verification code management
  setVerificationCode: async (userId: string, code: string, type: string, expiryInSeconds: number): Promise<void> => {
    const key = `verification:${type}:${userId}`;
    await redis.setex(key, expiryInSeconds, code);
  },

  getVerificationCode: async (userId: string, type: string): Promise<string | null> => {
    const key = `verification:${type}:${userId}`;
    return await redis.get(key);
  },

  deleteVerificationCode: async (userId: string, type: string): Promise<void> => {
    const key = `verification:${type}:${userId}`;
    await redis.del(key);
  },
};

// Connection function
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.ping();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};