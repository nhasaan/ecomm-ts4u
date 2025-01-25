import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../../shared/config';
import { AppError } from '../../shared/utils/error.handler';
import { RedisProvider } from '../../shared/providers/redis/redis.provider';
import { getRedisKey } from '../../shared/providers/redis/redis.keys';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError(401, 'No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };

    // Verify if token exists in Redis (session validation)
    const redisProvider = RedisProvider.getInstance();
    const cachedToken = await redisProvider.get(getRedisKey.userSession(decoded.userId));

    if (!cachedToken || cachedToken !== token) {
      throw new AppError(401, 'Session expired or invalid');
    }

    (request as any).user = decoded;
  } catch (error) {
    if (error instanceof AppError) {
      reply.code(error.statusCode).send({ error: error.message });
    } else {
      reply.code(401).send({ error: 'Authentication failed' });
    }
  }
}
