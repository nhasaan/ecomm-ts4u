import { FastifyInstance } from 'fastify';
import { publicProductRoutes } from './public.routes';
import { protectedProductRoutes } from './protected.routes';

export default async function productRoutes(fastify: FastifyInstance) {
  // Register public routes (product listing and details)
  await fastify.register(publicProductRoutes, { prefix: '/public' });

  // Register protected routes (create, update, delete)
  await fastify.register(protectedProductRoutes, { prefix: '/protected' });
}
