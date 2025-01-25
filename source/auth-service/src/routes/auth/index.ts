import { FastifyInstance } from 'fastify';
import { publicAuthRoutes } from './public.routes';
import { protectedAuthRoutes } from './protected.routes';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register public routes
  await fastify.register(publicAuthRoutes, { prefix: '/public' });

  // Register protected routes
  await fastify.register(protectedAuthRoutes, { prefix: '/protected' });
}
