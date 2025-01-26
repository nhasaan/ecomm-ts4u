import { ProductProvider } from '../../../shared/providers/product/product.provider';
import { RabbitMQProvider } from '../../../shared/providers/rabbitmq/rabbitmq.provider';
import { RedisProvider } from '../../../shared/providers/redis/redis.provider';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { AppError } from '../../../shared/utils/error.handler';
import { getRedisKey } from '../../../shared/providers/redis/redis.keys';
import { ProductFilter } from '../../../shared/providers/product/product.types';
import { logger } from '../../../shared/utils/logger';

export class ProductService {
  private productProvider: ProductProvider;
  private redisProvider: RedisProvider;
  private rabbitMQProvider: RabbitMQProvider;
  private readonly CACHE_TTL = 3600; // 1 hour in seconds

  constructor() {
    this.productProvider = ProductProvider.getInstance();
    this.redisProvider = RedisProvider.getInstance();
    this.rabbitMQProvider = RabbitMQProvider.getInstance();
  }

  async createProduct(productData: CreateProductDto) {
    try {
      const product = await this.productProvider.create(productData);

      // Publish event for inventory tracking
      await this.rabbitMQProvider.publish('product.created', {
        id: product.id,
        name: product.name,
        stock: product.stock,
      });

      // Invalidate products list cache
      await this.redisProvider.del(getRedisKey.productsList());

      logger.info(`Product created: ${product.id}`);
      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new AppError(500, 'Failed to create product');
    }
  }

  async getProduct(id: string) {
    try {
      const cacheKey = getRedisKey.productDetail(id);
      const cachedProduct = await this.redisProvider.get(cacheKey);

      if (cachedProduct) {
        logger.info(`Cache hit for product: ${id}`);
        return JSON.parse(cachedProduct);
      }

      const product = await this.productProvider.findById(id);
      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      // Cache product details
      await this.redisProvider.set(cacheKey, JSON.stringify(product), this.CACHE_TTL);

      return product;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error fetching product:', error);
      throw new AppError(500, 'Failed to fetch product');
    }
  }

  async listProducts(filter: ProductFilter) {
    try {
      const cacheKey = getRedisKey.productsList(filter);
      const cachedList = await this.redisProvider.get(cacheKey);

      if (cachedList) {
        logger.info('Cache hit for products list');
        return JSON.parse(cachedList);
      }

      const [items, total] = await this.productProvider.findMany(filter);
      const totalPages = Math.ceil(total / filter.limit);

      const result = {
        items,
        total,
        page: filter.page,
        totalPages,
      };

      // Cache the results
      await this.redisProvider.set(cacheKey, JSON.stringify(result), this.CACHE_TTL);

      return result;
    } catch (error) {
      logger.error('Error listing products:', error);
      throw new AppError(500, 'Failed to fetch products');
    }
  }

  async updateProduct(id: string, updateData: UpdateProductDto) {
    try {
      const product = await this.productProvider.findById(id);
      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      const updatedProduct = await this.productProvider.update(id, updateData);

      // Publish event for inventory updates if stock changed
      if (updateData.stock !== undefined) {
        await this.rabbitMQProvider.publish('product.stock.updated', {
          id: updatedProduct.id,
          name: updatedProduct.name,
          stock: updatedProduct.stock,
        });
      }

      // Invalidate caches
      await Promise.all([
        this.redisProvider.del(getRedisKey.productDetail(id)),
        this.redisProvider.del(getRedisKey.productsList()),
      ]);

      logger.info(`Product updated: ${id}`);
      return updatedProduct;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error updating product:', error);
      throw new AppError(500, 'Failed to update product');
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await this.productProvider.findById(id);
      if (!product) {
        throw new AppError(404, 'Product not found');
      }

      await this.productProvider.delete(id);

      // Publish event for inventory tracking
      await this.rabbitMQProvider.publish('product.deleted', {
        id: product.id,
        name: product.name,
      });

      // Invalidate caches
      await Promise.all([
        this.redisProvider.del(getRedisKey.productDetail(id)),
        this.redisProvider.del(getRedisKey.productsList()),
      ]);

      logger.info(`Product deleted: ${id}`);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error deleting product:', error);
      throw new AppError(500, 'Failed to delete product');
    }
  }
}
