// src/shared/config/index.ts
export const config = {
  port: parseInt(process.env.PORT || '8001', 10),
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || 'amqp://localhost',
    queues: {
      userEvents: 'user_events',
    },
  },
} as const;

// Optionally, you can define a type for your config
// export type Config = typeof config;
