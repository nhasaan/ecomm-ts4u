import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { UserValidator } from '../validators/user.validator';
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto';
import { handleError } from '../../../shared/utils/error.handler';
import { logger } from '../../../shared/utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userData = request.body as CreateUserDto;
      UserValidator.validateCreateUser(userData);

      const user = await this.userService.register(userData);
      logger.info(`User registered: ${user.id}`);
      reply.code(201).send(user);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Registration error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const loginData = request.body as LoginUserDto;
      UserValidator.validateLogin(loginData);

      const result = await this.userService.login(loginData);
      logger.info(`User logged in: ${loginData.email}`);
      reply.send(result);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Login error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;
      const profile = await this.userService.getProfile(userId);
      reply.send(profile);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Profile fetch error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;
      await this.userService.logout(userId);

      logger.info(`User logged out: ${userId}`);
      reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Logout error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }
}
