import { User } from '@prisma/client';

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserUpdate = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

// Export a type that excludes sensitive data
export type SafeUser = Omit<User, 'password'>;
