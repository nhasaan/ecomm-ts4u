import { PrismaClient, Product } from '@prisma/client';
import { logger } from '../../utils/logger';
import { ProductCreate, ProductUpdate, ProductFilter } from './product.types';

export class ProductProvider {
  private static instance: ProductProvider;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): ProductProvider {
    if (!ProductProvider.instance) {
      ProductProvider.instance = new ProductProvider();
    }
    return ProductProvider.instance;
  }

  async create(data: ProductCreate): Promise<Product> {
    try {
      return await this.prisma.product.create({ data });
    } catch (error) {
      logger.error('Product creation error:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      return await this.prisma.product.findUnique({ where: { id } });
    } catch (error) {
      logger.error('Product find by id error:', error);
      throw error;
    }
  }

  async findMany(filter: ProductFilter): Promise<[Product[], number]> {
    try {
      const where = {
        ...(filter.category && { category: filter.category }),
        ...(filter.minPrice && { price: { gte: filter.minPrice } }),
        ...(filter.maxPrice && { price: { lte: filter.maxPrice } }),
        ...(filter.search && {
          OR: [
            { name: { contains: filter.search, mode: 'insensitive' } },
            { description: { contains: filter.search, mode: 'insensitive' } },
          ],
        }),
      };

      const [items, total] = await Promise.all([
        this.prisma.product.findMany({
          where,
          skip: (filter.page - 1) * filter.limit,
          take: filter.limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.product.count({ where }),
      ]);

      return [items, total];
    } catch (error) {
      logger.error('Product find many error:', error);
      throw error;
    }
  }

  async update(id: string, data: ProductUpdate): Promise<Product> {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (error) {
      logger.error('Product update error:', error);
      throw error;
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      logger.error('Product deletion error:', error);
      throw error;
    }
  }
}
