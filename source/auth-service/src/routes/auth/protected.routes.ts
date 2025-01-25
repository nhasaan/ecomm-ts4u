import { FastifyInstance } from 'fastify';
import { UserController } from '../../resources/users/controllers/user.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { profileSchema } from './schemas';

export async function protectedAuthRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.get(
    '/profile',
    {
      preHandler: [authenticate],
      schema: profileSchema,
    },
    userController.getProfile.bind(userController),
  );

  fastify.post(
    '/logout',
    {
      preHandler: [authenticate],
      schema: {
        // Define logout schema here
      },
    },
    userController.logout.bind(userController),
  );
}
