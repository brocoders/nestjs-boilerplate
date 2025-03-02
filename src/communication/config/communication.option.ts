import { ConfigService } from '@nestjs/config';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import {
  RMQ_DEFAULT_COMMUNICATION_URLS,
  RMQ_DEFAULT_QUEUES,
  RMQ_NO_ACK,
  RMQ_PERSISTENT,
  RMQ_PREFETCH_COUNT,
  RMQ_QUEUE_DURABLE,
} from '../types/rabbitmq.type';

export const RabbitMQClientOptions = (
  configService: ConfigService,
  options: { consumer?: boolean; queueName?: string } = {},
): MicroserviceOptions | RmqOptions => {
  // Retrieve RabbitMQ URLs from configuration
  const rabbitmqUrlsRaw = configService.get<string | string[]>(
    'communication.rabbitmqUrls',
    { infer: true },
  );

  // Ensure URLs are always an array
  const rabbitmqUrls: string[] = Array.isArray(rabbitmqUrlsRaw)
    ? rabbitmqUrlsRaw
    : typeof rabbitmqUrlsRaw === 'string'
      ? rabbitmqUrlsRaw.split(',').map((url) => url.trim()) // Convert string to array
      : RMQ_DEFAULT_COMMUNICATION_URLS; // Fallback to default URLs

  // Retrieve RabbitMQ Queues from configuration
  const rabbitmqQueues =
    configService.get<string[]>('communication.rabbitmqQueues', {
      infer: true,
    }) || RMQ_DEFAULT_QUEUES;

  // Validate queue selection: Either use the provided queue or fallback to default
  const selectedQueue =
    options.queueName && rabbitmqQueues.includes(options.queueName)
      ? options.queueName
      : rabbitmqQueues.length > 0
        ? rabbitmqQueues[0]
        : (() => {
            throw new Error(
              'RabbitMQ Consumer Error: No valid queues found in configuration!',
            );
          })(); // Throw error if no queues are found

  return {
    transport: Transport.RMQ, // Explicitly set to Transport.RMQ
    options: {
      urls: rabbitmqUrls, // Ensured as an array
      queue: selectedQueue,
      queueOptions: {
        durable:
          configService.get<boolean>('communication.rabbitmqQueueDurable', {
            infer: true,
          }) ?? RMQ_QUEUE_DURABLE,
      },
      prefetchCount: options.consumer
        ? (configService.get<number>('communication.rabbitmqPrefetchCount', {
            infer: true,
          }) ?? RMQ_PREFETCH_COUNT)
        : 1,
      noAck:
        configService.get<boolean>('communication.rabbitmqNoAck', {
          infer: true,
        }) ?? RMQ_NO_ACK,
      persistent:
        configService.get<boolean>('communication.rabbitmqPersistent', {
          infer: true,
        }) ?? RMQ_PERSISTENT,
    },
  };
};
