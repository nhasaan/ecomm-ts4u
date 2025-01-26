import { redisConfig } from './redis.config';
import { rabbitmqConfig } from './rabbitmq.config';

export const config = {
  port: process.env.PORT || 8002,
  nodeEnv: process.env.NODE_ENV || 'development',
  redis: redisConfig,
  rabbitmq: rabbitmqConfig,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    timeWindow: process.env.RATE_LIMIT_WINDOW || '1 minute',
  },
} as const;
