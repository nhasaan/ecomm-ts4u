import { FastifyInstance } from 'fastify';
import { ProductController } from '../../resources/products/controllers/product.controller';
import { authenticate } from '../../shared/middlewares/auth.middleware';
import { createProductSchema, updateProductSchema } from './schemas';

export async function protectedProductRoutes(fastify: FastifyInstance) {
  const productController = new ProductController();

  fastify.post(
    '/',
    {
      preHandler: [authenticate],
      schema: createProductSchema,
    },
    productController.createProduct.bind(productController),
  );

  fastify.put(
    '/:id',
    {
      preHandler: [authenticate],
      schema: updateProductSchema,
    },
    productController.updateProduct.bind(productController),
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          204: {
            type: 'null',
          },
          404: {
            type: 'object',
            properties: {
              error: { type: 'string' },
            },
          },
        },
      },
    },
    productController.deleteProduct.bind(productController),
  );
}
