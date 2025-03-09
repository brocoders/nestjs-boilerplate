import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  RMQ_NO_ACK,
  RMQ_PERSISTENT,
  RMQ_PREFETCH_COUNT,
  RMQ_QUEUE_DURABLE,
} from '../types/rabbitmq.const';

/**
 * Create a base RabbitMQ configuration that can be modified per service.
 * @param configService - NestJS ConfigService to fetch dynamic configurations
 */
export const createRabbitMQBaseOptions = (
  configService: ConfigService,
): RmqOptions => {
  // Retrieve RabbitMQ URLs from configuration
  const rabbitmqUrlsRaw = configService.get<string | string[]>(
    'rabbitMQ.rabbitmqUrls',
    { infer: true },
  );

  // Ensure URLs are always an array
  const rabbitmqUrls: string[] = Array.isArray(rabbitmqUrlsRaw)
    ? rabbitmqUrlsRaw
    : typeof rabbitmqUrlsRaw === 'string'
      ? rabbitmqUrlsRaw.split(',').map((url) => url.trim()) // Convert string to array
      : ['amqp://localhost:5672']; // Fallback default URL

  return {
    transport: Transport.RMQ,
    options: {
      urls: rabbitmqUrls, // Ensured as an array
      queueOptions: {
        durable:
          configService.get<boolean>('rabbitMQ.rabbitmqQueueDurable', {
            infer: true,
          }) ?? RMQ_QUEUE_DURABLE,
      },
      prefetchCount:
        configService.get<number>('rabbitMQ.rabbitmqPrefetchCount', {
          infer: true,
        }) ?? RMQ_PREFETCH_COUNT,
      noAck:
        configService.get<boolean>('rabbitMQ.rabbitmqNoAck', { infer: true }) ??
        RMQ_NO_ACK,
      persistent:
        configService.get<boolean>('rabbitMQ.rabbitmqPersistent', {
          infer: true,
        }) ?? RMQ_PERSISTENT,
    },
  };
};

/**
 * Modify the RabbitMQ configuration dynamically based on the service needs.
 * @param baseOptions - The base RabbitMQ configuration
 * @param options - Customizable options (queue name, exchange name, routing key)
 */
export const updateRabbitMQOptions = (
  baseOptions: RmqOptions,
  options: { queueName: string; exchangeName: string; routingKey: string },
): RmqOptions => {
  return {
    transport: Transport.RMQ,
    options: {
      ...baseOptions.options,
      queue: options.queueName,
      exchange: options.exchangeName,
      routingKey: options.routingKey,
    },
  };
};
