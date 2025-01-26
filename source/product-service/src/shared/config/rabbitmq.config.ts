export const rabbitmqConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost',
  exchanges: {
    products: 'products.events',
  },
  queues: {
    productEvents: 'product.events.queue',
  },
  routingKeys: {
    productCreated: 'product.created',
    productUpdated: 'product.updated',
    productDeleted: 'product.deleted',
    stockUpdated: 'product.stock.updated',
  },
};
