import { PrismaClient, User } from '@prisma/client';
import { UserCreate, UserUpdate } from './user.types';
import { logger } from '../../utils/logger';

export class UserProvider {
  private static instance: UserProvider;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): UserProvider {
    if (!UserProvider.instance) {
      UserProvider.instance = new UserProvider();
    }
    return UserProvider.instance;
  }

  async create(data: UserCreate): Promise<User> {
    try {
      return await this.prisma.user.create({ data });
    } catch (error) {
      logger.error('User creation error:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      logger.error('User find by email error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id } });
    } catch (error) {
      logger.error('User find by id error:', error);
      throw error;
    }
  }

  async update(id: string, data: UserUpdate): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('User update error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      logger.error('User deletion error:', error);
      throw error;
    }
  }
}
