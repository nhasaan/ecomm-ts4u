// src/server.ts
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { Redis } from 'ioredis';
import { config } from './shared/config';
import { logger } from './shared/utils/logger';
import authRoutes from './routes/auth';
import { createRedisClient } from './shared/providers/redis/redis.provider';

class Server {
  private fastify: FastifyInstance;
  private redisClient: Redis;

  constructor() {
    this.fastify = Fastify({
      logger: true,
      trustProxy: true,
    });
    this.redisClient = createRedisClient();
  }

  async setup() {
    // Register plugins
    await this.fastify.register(cors, {
      origin: process.env.ALLOWED_ORIGINS?.split(',') || true,
      credentials: true,
    });

    await this.fastify.register(helmet);

    await this.fastify.register(rateLimit, {
      max: 100,
      timeWindow: '1 minute',
      redis: this.redisClient,
    });

    // Register routes
    await this.fastify.register(authRoutes, { prefix: '/api/auth' });

    // Global error handler
    this.fastify.setErrorHandler((error, request, reply) => {
      logger.error(error);
      reply.status(error.statusCode || 500).send({
        error: {
          message: error.message || 'Internal Server Error',
          statusCode: error.statusCode || 500,
        },
      });
    });
  }

  async start() {
    try {
      await this.setup();
      const address = await this.fastify.listen({
        port: config.port as number,
        host: '0.0.0.0',
        listenTextResolver: addr => `Server listening at ${addr}`,
      });
      logger.info(address);
    } catch (err) {
      logger.error('Error starting server:', err);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await this.fastify.close();
      await this.redisClient.quit();
    } catch (err) {
      logger.error('Error stopping server:', err);
      process.exit(1);
    }
  }
}

// Start the server
const server = new Server();
server.start();

// Handle graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  try {
    await server.stop();
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default server;
