import { FastifyRequest, FastifyReply } from 'fastify';
import { ProductService } from '../services/product.service';
import { ProductValidator } from '../validators/product.validator';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';
import { handleError } from '../../../shared/utils/error.handler';
import { logger } from '../../../shared/utils/logger';
import { ProductFilter } from '../../../shared/providers/product/product.types';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
      const productData = request.body as CreateProductDto;
      ProductValidator.validateCreateProduct(productData);

      const product = await this.productService.createProduct(productData);
      reply.code(201).send(product);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Product creation error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async getProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const product = await this.productService.getProduct(id);
      reply.send(product);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Product fetch error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async listProducts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = request.query as {
        page?: number;
        limit?: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
      };

      const filter: ProductFilter = {
        page: Number(query.page) || 1,
        limit: Number(query.limit) || 10,
        category: query.category,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        search: query.search,
      };

      const products = await this.productService.listProducts(filter);
      reply.send(products);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Products list error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async updateProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const updateData = request.body as UpdateProductDto;
      ProductValidator.validateUpdateProduct(updateData);

      const product = await this.productService.updateProduct(id, updateData);
      reply.send(product);
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Product update error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }

  async deleteProduct(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.productService.deleteProduct(id);
      reply.code(204).send();
    } catch (error) {
      const errorResponse = handleError(error);
      logger.error('Product deletion error:', { error });
      reply.code(errorResponse.statusCode).send({
        error: errorResponse.message,
      });
    }
  }
}
