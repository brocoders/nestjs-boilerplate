import { KafkaAutoOffsetReset, KafkaCompressionType } from './kafka.enum';

export const KAFKA_DEFAULT_BROKERS: string[] = ['localhost:9092'];
export const KAFKA_DEFAULT_CLIENT_ID: string = 'nestjs-kafka-client';
export const KAFKA_DEFAULT_GROUP_ID: string = 'nestjs-kafka-group';
export const KAFKA_DEFAULT_ACKS: number = -1; // -1 (All replicas must acknowledge)
export const KAFKA_DEFAULT_AUTO_COMMIT: boolean = false;
export const KAFKA_DEFAULT_SESSION_TIMEOUT: number = 50000; // 30 seconds

export const KAFKA_DEFAULT_AUTO_OFFSET_RESET: KafkaAutoOffsetReset =
  KafkaAutoOffsetReset.LATEST;

export const KAFKA_DEFAULT_RETRY_ATTEMPTS: number = 5;
export const KAFKA_DEFAULT_MAX_POLL_RECORDS: number = 10;
export const KAFKA_DEFAULT_FETCH_MIN_BYTES: number = 1;
export const KAFKA_DEFAULT_FETCH_MAX_WAIT_MS: number = 500;
export const KAFKA_DEFAULT_ENABLE_PARTITION_ASSIGNMENT: boolean = false;
export const KAFKA_DEFAULT_ALLOW_AUTO_TOPIC_CREATION: boolean = false;

/**
 * Default timeout (in milliseconds) before a consumer request is considered failed.
 * Default: 30000 (30 seconds)
 */
export const KAFKA_DEFAULT_CONSUMER_REQUEST_TIMEOUT: number = 30000;

/**
 * Default compression type for Kafka messages.
 * Options: "none", "gzip", "snappy", "lz4", "zstd"
 * Default: "none"
 */
export const KAFKA_DEFAULT_COMPRESSION_TYPE: KafkaCompressionType =
  KafkaCompressionType.NONE;
