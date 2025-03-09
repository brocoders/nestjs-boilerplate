import { registerAs } from '@nestjs/config';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../../utils/validate-config';

import {
  KAFKA_DEFAULT_BROKERS,
  KAFKA_DEFAULT_CLIENT_ID,
  KAFKA_DEFAULT_GROUP_ID,
  KAFKA_DEFAULT_ACKS,
  KAFKA_DEFAULT_AUTO_COMMIT,
  KAFKA_DEFAULT_SESSION_TIMEOUT,
  KAFKA_DEFAULT_AUTO_OFFSET_RESET,
  KAFKA_DEFAULT_RETRY_ATTEMPTS,
  KAFKA_DEFAULT_MAX_POLL_RECORDS,
  KAFKA_DEFAULT_FETCH_MIN_BYTES,
  KAFKA_DEFAULT_FETCH_MAX_WAIT_MS,
  KAFKA_DEFAULT_ENABLE_PARTITION_ASSIGNMENT,
  KAFKA_DEFAULT_ALLOW_AUTO_TOPIC_CREATION,
  KAFKA_DEFAULT_CONSUMER_REQUEST_TIMEOUT,
  KAFKA_DEFAULT_COMPRESSION_TYPE,
} from '../types/kafka.const';
import { KafkaConfig } from './kafka-config.type';
import {
  KafkaAutoOffsetReset,
  KafkaCompressionType,
} from '../types/kafka.enum';

// Validator class for environment variables
class EnvironmentVariablesValidator {
  @IsBoolean()
  @IsOptional()
  COMMUNICATION_ENABLE_KAFKA?: boolean;

  @IsString()
  @IsOptional()
  COMMUNICATION_KAFKA_BROKERS?: string;

  @IsString()
  @IsOptional()
  COMMUNICATION_KAFKA_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  COMMUNICATION_KAFKA_GROUP_ID?: string;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_ACKS?: number;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_KAFKA_AUTO_COMMIT?: boolean;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_SESSION_TIMEOUT?: number;

  @IsString()
  @IsOptional()
  COMMUNICATION_KAFKA_AUTO_OFFSET_RESET?: KafkaAutoOffsetReset;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_RETRY_ATTEMPTS?: number;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_MAX_POLL_RECORDS?: number;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_FETCH_MIN_BYTES?: number;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_FETCH_MAX_WAIT_MS?: number;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_KAFKA_ENABLE_PARTITION_ASSIGNMENT?: boolean;

  @IsBoolean()
  @IsOptional()
  COMMUNICATION_KAFKA_ALLOW_AUTO_TOPIC_CREATION?: boolean;

  @IsInt()
  @IsOptional()
  COMMUNICATION_KAFKA_CONSUMER_REQUEST_TIMEOUT?: number;

  @IsString()
  @IsOptional()
  COMMUNICATION_KAFKA_COMPRESSION_TYPE?: KafkaCompressionType;
}

export default registerAs<KafkaConfig>('kafka', (): KafkaConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    enableKafka:
      process.env.COMMUNICATION_ENABLE_KAFKA?.toLowerCase() === 'true' || false,
    kafkaBrokers: process.env.COMMUNICATION_KAFKA_BROKERS
      ? process.env.COMMUNICATION_KAFKA_BROKERS.split(',')
      : KAFKA_DEFAULT_BROKERS,
    kafkaClientId:
      process.env.COMMUNICATION_KAFKA_CLIENT_ID || KAFKA_DEFAULT_CLIENT_ID,
    kafkaGroupId:
      process.env.COMMUNICATION_KAFKA_GROUP_ID || KAFKA_DEFAULT_GROUP_ID,
    kafkaAcks: process.env.COMMUNICATION_KAFKA_ACKS
      ? Number(process.env.COMMUNICATION_KAFKA_ACKS)
      : KAFKA_DEFAULT_ACKS,
    autoCommit: process.env.COMMUNICATION_KAFKA_AUTO_COMMIT
      ? process.env.COMMUNICATION_KAFKA_AUTO_COMMIT.toLowerCase() === 'true'
      : KAFKA_DEFAULT_AUTO_COMMIT,
    sessionTimeout: process.env.COMMUNICATION_KAFKA_SESSION_TIMEOUT
      ? Number(process.env.COMMUNICATION_KAFKA_SESSION_TIMEOUT)
      : KAFKA_DEFAULT_SESSION_TIMEOUT,
    autoOffsetReset:
      (process.env
        .COMMUNICATION_KAFKA_AUTO_OFFSET_RESET as KafkaAutoOffsetReset) ||
      KAFKA_DEFAULT_AUTO_OFFSET_RESET,
    retryAttempts: process.env.COMMUNICATION_KAFKA_RETRY_ATTEMPTS
      ? Number(process.env.COMMUNICATION_KAFKA_RETRY_ATTEMPTS)
      : KAFKA_DEFAULT_RETRY_ATTEMPTS,
    maxPollRecords: process.env.COMMUNICATION_KAFKA_MAX_POLL_RECORDS
      ? Number(process.env.COMMUNICATION_KAFKA_MAX_POLL_RECORDS)
      : KAFKA_DEFAULT_MAX_POLL_RECORDS,
    fetchMinBytes: process.env.COMMUNICATION_KAFKA_FETCH_MIN_BYTES
      ? Number(process.env.COMMUNICATION_KAFKA_FETCH_MIN_BYTES)
      : KAFKA_DEFAULT_FETCH_MIN_BYTES,
    fetchMaxWaitMs: process.env.COMMUNICATION_KAFKA_FETCH_MAX_WAIT_MS
      ? Number(process.env.COMMUNICATION_KAFKA_FETCH_MAX_WAIT_MS)
      : KAFKA_DEFAULT_FETCH_MAX_WAIT_MS,
    enablePartitionAssignment:
      process.env.COMMUNICATION_KAFKA_ENABLE_PARTITION_ASSIGNMENT?.toLowerCase() ===
        'true' || KAFKA_DEFAULT_ENABLE_PARTITION_ASSIGNMENT,
    allowAutoTopicCreation:
      process.env.COMMUNICATION_KAFKA_ALLOW_AUTO_TOPIC_CREATION?.toLowerCase() ===
        'true' || KAFKA_DEFAULT_ALLOW_AUTO_TOPIC_CREATION,
    consumerRequestTimeout: process.env
      .COMMUNICATION_KAFKA_CONSUMER_REQUEST_TIMEOUT
      ? Number(process.env.COMMUNICATION_KAFKA_CONSUMER_REQUEST_TIMEOUT)
      : KAFKA_DEFAULT_CONSUMER_REQUEST_TIMEOUT,
    compressionType:
      (process.env
        .COMMUNICATION_KAFKA_COMPRESSION_TYPE as KafkaCompressionType) ||
      KAFKA_DEFAULT_COMPRESSION_TYPE,
  };
});
