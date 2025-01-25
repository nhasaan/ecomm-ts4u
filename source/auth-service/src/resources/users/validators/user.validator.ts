import { CreateUserDto, LoginUserDto } from '../dtos/user.dto';
import { AppError } from '../../../shared/utils/error.handler';

export class UserValidator {
  static validateCreateUser(data: CreateUserDto): void {
    const { name, email, password } = data;

    if (!name || typeof name !== 'string' || name.length < 2) {
      throw new AppError(400, 'Name must be at least 2 characters long');
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new AppError(400, 'Invalid email format');
    }

    if (!password || password.length < 6) {
      throw new AppError(400, 'Password must be at least 6 characters long');
    }
  }

  static validateLogin(data: LoginUserDto): void {
    const { email, password } = data;

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new AppError(400, 'Invalid email format');
    }

    if (!password) {
      throw new AppError(400, 'Password is required');
    }
  }
}
