import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, {
  retryDelayOnFailover: 100,
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
};