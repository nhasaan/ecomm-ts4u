import { FastifyInstance } from 'fastify';
import { UserController } from '../../resources/users/controllers/user.controller';
import { registerSchema, loginSchema } from './schemas';

export async function publicAuthRoutes(fastify: FastifyInstance) {
  const userController = new UserController();

  fastify.post(
    '/register',
    { schema: registerSchema },
    userController.register.bind(userController),
  );

  fastify.post('/login', { schema: loginSchema }, userController.login.bind(userController));
}
