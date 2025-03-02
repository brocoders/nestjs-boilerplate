import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { CommunicationConfig } from './communication-config.type';
import {
  RMQ_QUEUE_DURABLE,
  RMQ_PREFETCH_COUNT,
  RMQ_NO_ACK,
  RMQ_DEFAULT_QUEUES,
  RMQ_PERSISTENT,
  RMQ_DEFAULT_COMMUNICATION_URLS,
} from '../types/rabbitmq.type';

// Validator class for environment variables
class CommunicationEnvironmentValidator {
  /**
   * Enable or disable RabbitMQ.
   * Default: false
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_RABBITMQ: boolean = false;

  /**
   * Enable or disable Kafka.
   * Default: false
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_KAFKA: boolean = false;

  /**
   * Enable or disable Redis.
   * Default: false
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_REDIS: boolean = false;

  /**
   * RabbitMQ connection URLs (comma-separated).
   * Example: amqp://user:password@rabbitmq-host:5672,amqp://user:password@another-host:5672
   */
  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_URLS: string;

  /**
   * RabbitMQ queue names (comma-separated).
   * Example: order.queue,payment.queue,shipping.queue
   */
  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_QUEUES: string;

  /**
   * RabbitMQ prefetch count (number of messages to fetch at a time)
   */
  @IsInt()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PREFETCH_COUNT: number = RMQ_PREFETCH_COUNT;

  /**
   * RabbitMQ acknowledgment mode (true = auto-ack)
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_NO_ACK: boolean = RMQ_NO_ACK;

  /**
   * RabbitMQ queue durability
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_QUEUE_DURABLE: boolean = RMQ_QUEUE_DURABLE;

  /**
   * RabbitMQ message persistence (false = messages are not persisted)
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PERSISTENT: boolean = RMQ_PERSISTENT;
}

export default registerAs<CommunicationConfig>('communication', () => {
  // Validate the environment variables using the defined validator
  const validatedEnv = validateConfig(
    process.env,
    CommunicationEnvironmentValidator,
  );

  return {
    enableRabbitMQ: validatedEnv.COMMUNICATION_ENABLE_RABBITMQ,
    enableKafka: validatedEnv.COMMUNICATION_ENABLE_KAFKA,
    enableRedis: validatedEnv.COMMUNICATION_ENABLE_REDIS,
    rabbitmqUrls: validatedEnv.COMMUNICATION_RABBITMQ_URLS
      ? validatedEnv.COMMUNICATION_RABBITMQ_URLS.split(',')
      : RMQ_DEFAULT_COMMUNICATION_URLS, // Default if not set
    rabbitmqQueues: validatedEnv.COMMUNICATION_RABBITMQ_QUEUES
      ? validatedEnv.COMMUNICATION_RABBITMQ_QUEUES.split(',')
      : RMQ_DEFAULT_QUEUES, // Default queue if not set
    rabbitmqPrefetchCount:
      validatedEnv.COMMUNICATION_RABBITMQ_PREFETCH_COUNT || RMQ_PREFETCH_COUNT,
    rabbitmqNoAck: validatedEnv.COMMUNICATION_RABBITMQ_NO_ACK || RMQ_NO_ACK,
    rabbitmqQueueDurable:
      validatedEnv.COMMUNICATION_RABBITMQ_QUEUE_DURABLE || RMQ_QUEUE_DURABLE,
    rabbitmqPersistent:
      validatedEnv.COMMUNICATION_RABBITMQ_PERSISTENT || RMQ_PERSISTENT,
  };
});
