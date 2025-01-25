import { Redis } from 'ioredis';
import { redisConfig } from '../../config/redis.config';
import { logger } from '../../utils/logger';

export const createRedisClient = () => {
  return new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
    db: redisConfig.db,
    keyPrefix: redisConfig.keyPrefix,
  });
};

export class RedisProvider {
  private static instance: RedisProvider;
  private client: Redis;

  private constructor() {
    this.client = createRedisClient();

    this.client.on('error', error => {
      logger.error('Redis client error:', error);
    });
  }

  static getInstance(): RedisProvider {
    if (!RedisProvider.instance) {
      RedisProvider.instance = new RedisProvider();
    }
    return RedisProvider.instance;
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, 'EX', ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}
