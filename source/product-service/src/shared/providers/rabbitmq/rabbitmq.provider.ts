import amqp, { Channel, Connection } from 'amqplib';
import { rabbitmqConfig } from '../../config/rabbitmq.config';
import { logger } from '../../utils/logger';

export class RabbitMQProvider {
  private static instance: RabbitMQProvider;
  private connection?: Connection;
  private channel?: Channel;

  private constructor() {}

  static getInstance(): RabbitMQProvider {
    if (!RabbitMQProvider.instance) {
      RabbitMQProvider.instance = new RabbitMQProvider();
    }
    return RabbitMQProvider.instance;
  }

  async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(rabbitmqConfig.url);
      this.channel = await this.connection.createChannel();

      // Setup exchange
      await this.channel.assertExchange(rabbitmqConfig.exchanges.products, 'topic', {
        durable: true,
      });

      // Setup queue
      await this.channel.assertQueue(rabbitmqConfig.queues.productEvents, {
        durable: true,
      });

      // Bind queue to exchange with routing keys
      const routingKeys = Object.values(rabbitmqConfig.routingKeys);
      for (const key of routingKeys) {
        await this.channel.bindQueue(
          rabbitmqConfig.queues.productEvents,
          rabbitmqConfig.exchanges.products,
          key,
        );
      }

      logger.info('RabbitMQ connection established');
    } catch (error) {
      logger.error('Failed to initialize RabbitMQ:', error);
      throw error;
    }
  }

  async publish(routingKey: string, message: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.initialize();
      }

      this.channel?.publish(
        rabbitmqConfig.exchanges.products,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          timestamp: Date.now(),
        },
      );
    } catch (error) {
      logger.error('Failed to publish message:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      logger.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}
