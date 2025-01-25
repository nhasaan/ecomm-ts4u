import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserProvider } from '../../../shared/providers/user/user.provider';
import { RedisProvider } from '../../../shared/providers/redis/redis.provider';
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto';
import { AppError } from '../../../shared/utils/error.handler';
import { config } from '../../../shared/config';
import { getRedisKey } from '../../../shared/providers/redis/redis.keys';

export class UserService {
  private userProvider: UserProvider;
  private redisProvider: RedisProvider;

  constructor() {
    this.userProvider = UserProvider.getInstance();
    this.redisProvider = RedisProvider.getInstance();
  }

  async register(userData: CreateUserDto) {
    const existingUser = await this.userProvider.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError(400, 'Email already registered');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userProvider.create({
      ...userData,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async login(loginData: LoginUserDto) {
    const user = await this.userProvider.findByEmail(loginData.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const validPassword = await bcrypt.compare(loginData.password, user.password);
    if (!validPassword) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: '24h',
    });

    // Cache user session
    await this.redisProvider.set(
      getRedisKey.userSession(user.id),
      token,
      24 * 60 * 60, // 24 hours
    );

    return { token };
  }

  async getProfile(userId: string) {
    const user = await this.userProvider.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async logout(userId: string): Promise<void> {
    try {
      // Delete the session from Redis
      await this.redisProvider.del(getRedisKey.userSession(userId));
    } catch (error) {
      throw new AppError(500, 'Error during logout');
    }
  }
}
