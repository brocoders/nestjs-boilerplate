import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../../utils/validate-config';
import { RabbitMQConfig } from './rabbitmq-config.type';
import {
  RMQ_QUEUE_DURABLE,
  RMQ_PREFETCH_COUNT,
  RMQ_NO_ACK,
  RMQ_PERSISTENT,
  RMQ_DEFAULT_COMMUNICATION_URLS,
} from '../types/rabbitmq.type';

// Validator class for environment variables
class EnvironmentVariablesValidator {
  /**
   * Enable or disable RabbitMQ.
   * Default: false
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_RABBITMQ?: boolean;

  /**
   * RabbitMQ connection URLs (comma-separated).
   */
  @IsString()
  @IsOptional()
  COMMUNICATION_RABBITMQ_URLS?: string;

  /**
   * RabbitMQ prefetch count (number of messages to fetch at a time)
   */
  @IsInt()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PREFETCH_COUNT?: number;

  /**
   * RabbitMQ acknowledgment mode (true = auto-ack)
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_NO_ACK?: boolean;

  /**
   * RabbitMQ queue durability
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_QUEUE_DURABLE?: boolean;

  /**
   * RabbitMQ message persistence (false = messages are not persisted)
   */
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_RABBITMQ_PERSISTENT?: boolean;
}

export default registerAs<RabbitMQConfig>('rabbitMQ', () => {
  // Validate the environment variables using the defined validator
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enableRabbitMQ:
      process.env.COMMUNICATION_ENABLE_RABBITMQ?.toLowerCase() === 'true', // Convert string to boolean
    rabbitmqUrls: process.env.COMMUNICATION_RABBITMQ_URLS
      ? process.env.COMMUNICATION_RABBITMQ_URLS.split(',')
      : RMQ_DEFAULT_COMMUNICATION_URLS, // Default if not set
    rabbitmqPrefetchCount: process.env.COMMUNICATION_RABBITMQ_PREFETCH_COUNT
      ? Number(process.env.COMMUNICATION_RABBITMQ_PREFETCH_COUNT) // Convert to number
      : RMQ_PREFETCH_COUNT,
    rabbitmqNoAck: process.env.COMMUNICATION_RABBITMQ_NO_ACK
      ? process.env.COMMUNICATION_RABBITMQ_NO_ACK.toLowerCase() === 'true' // Convert to boolean
      : RMQ_NO_ACK,
    rabbitmqQueueDurable: process.env.COMMUNICATION_RABBITMQ_QUEUE_DURABLE
      ? process.env.COMMUNICATION_RABBITMQ_QUEUE_DURABLE.toLowerCase() ===
        'true' // Convert to boolean
      : RMQ_QUEUE_DURABLE,
    rabbitmqPersistent: process.env.COMMUNICATION_RABBITMQ_PERSISTENT
      ? process.env.COMMUNICATION_RABBITMQ_PERSISTENT.toLowerCase() === 'true' // Convert to boolean
      : RMQ_PERSISTENT,
  };
});
