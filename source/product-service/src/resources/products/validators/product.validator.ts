import { AppError } from '../../../shared/utils/error.handler';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

export class ProductValidator {
  static validateCreateProduct(data: CreateProductDto) {
    if (!data.name || data.name.length < 2 || data.name.length > 100) {
      throw new AppError(400, 'Name must be between 2 and 100 characters');
    }

    if (!data.description || data.description.length < 10 || data.description.length > 1000) {
      throw new AppError(400, 'Description must be between 10 and 1000 characters');
    }

    if (typeof data.price !== 'number' || data.price < 0) {
      throw new AppError(400, 'Price must be a non-negative number');
    }

    if (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock)) {
      throw new AppError(400, 'Stock must be a non-negative integer');
    }

    if (data.category && (data.category.length < 2 || data.category.length > 50)) {
      throw new AppError(400, 'Category must be between 2 and 50 characters');
    }
  }

  static validateUpdateProduct(data: UpdateProductDto) {
    if (Object.keys(data).length === 0) {
      throw new AppError(400, 'No update data provided');
    }

    if (data.name !== undefined) {
      if (data.name.length < 2 || data.name.length > 100) {
        throw new AppError(400, 'Name must be between 2 and 100 characters');
      }
    }

    if (data.description !== undefined) {
      if (data.description.length < 10 || data.description.length > 1000) {
        throw new AppError(400, 'Description must be between 10 and 1000 characters');
      }
    }

    if (data.price !== undefined) {
      if (typeof data.price !== 'number' || data.price < 0) {
        throw new AppError(400, 'Price must be a non-negative number');
      }
    }

    if (data.stock !== undefined) {
      if (typeof data.stock !== 'number' || data.stock < 0 || !Number.isInteger(data.stock)) {
        throw new AppError(400, 'Stock must be a non-negative integer');
      }
    }

    if (data.category !== undefined) {
      if (data.category.length < 2 || data.category.length > 50) {
        throw new AppError(400, 'Category must be between 2 and 50 characters');
      }
    }
  }
}
