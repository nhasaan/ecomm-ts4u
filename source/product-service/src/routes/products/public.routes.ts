import { FastifyInstance } from 'fastify';
import { ProductController } from '../../resources/products/controllers/product.controller';
import { getProductSchema, listProductsSchema } from './schemas';

export async function publicProductRoutes(fastify: FastifyInstance) {
  const productController = new ProductController();

  fastify.get(
    '/',
    { schema: listProductsSchema },
    productController.listProducts.bind(productController),
  );

  fastify.get(
    '/:id',
    { schema: getProductSchema },
    productController.getProduct.bind(productController),
  );
}
