import { createClient } from 'redis';
import { logger } from '../utils/logger';

let redisClient: ReturnType<typeof createClient>;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        connectTimeout: 60000,
        lazyConnect: true,
      },
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis Client Ready');
    });

    await redisClient.connect();
    
    // Test connection
    await redisClient.ping();
    logger.info('Redis connection successful');
    
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

// Redis utility functions
export const redisUtils = {
  // Session management
  setSession: async (sessionId: string, data: any, ttl: number = 86400) => {
    const client = getRedisClient();
    await client.setEx(`session:${sessionId}`, ttl, JSON.stringify(data));
  },

  getSession: async (sessionId: string) => {
    const client = getRedisClient();
    const data = await client.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  },

  deleteSession: async (sessionId: string) => {
    const client = getRedisClient();
    await client.del(`session:${sessionId}`);
  },

  // Verification codes
  setVerificationCode: async (userId: string, code: string, type: string, ttl: number = 600) => {
    const client = getRedisClient();
    await client.setEx(`verification:${type}:${userId}`, ttl, code);
  },

  getVerificationCode: async (userId: string, type: string) => {
    const client = getRedisClient();
    return await client.get(`verification:${type}:${userId}`);
  },

  deleteVerificationCode: async (userId: string, type: string) => {
    const client = getRedisClient();
    await client.del(`verification:${type}:${userId}`);
  },

  // Rate limiting
  incrementRateLimit: async (key: string, ttl: number = 3600) => {
    const client = getRedisClient();
    const current = await client.incr(`ratelimit:${key}`);
    if (current === 1) {
      await client.expire(`ratelimit:${key}`, ttl);
    }
    return current;
  },

  // Cache
  setCache: async (key: string, data: any, ttl: number = 3600) => {
    const client = getRedisClient();
    await client.setEx(`cache:${key}`, ttl, JSON.stringify(data));
  },

  getCache: async (key: string) => {
    const client = getRedisClient();
    const data = await client.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  },

  deleteCache: async (key: string) => {
    const client = getRedisClient();
    await client.del(`cache:${key}`);
  },
};