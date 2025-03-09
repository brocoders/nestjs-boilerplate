import { KafkaCompressionType } from '../types/kafka.enum';

export type KafkaConfig = {
  /**
   * Whether Kafka is enabled.
   * Default: false
   */
  enableKafka: boolean;

  /**
   * List of Kafka broker URLs.
   * Example: ["localhost:9092", "kafka-broker-2:9092"]
   */
  kafkaBrokers: string[];

  /**
   * Kafka client ID used to identify this application.
   * Default: "nestjs-kafka-client"
   */
  kafkaClientId: string;

  /**
   * Kafka consumer group ID (used to manage multiple consumers).
   * Default: "nestjs-kafka-group"
   */
  kafkaGroupId: string;

  /**
   * Kafka acknowledgment mode.
   * -1 (All replicas must acknowledge)
   *  1 (Leader-only acknowledgment)
   *  0 (No acknowledgment)
   * Default: -1
   */
  kafkaAcks: number;

  /**
   * Whether Kafka consumers should auto-commit offsets.
   * If false, offsets must be committed manually.
   * Default: false
   */
  autoCommit: boolean;

  /**
   * Kafka session timeout (in milliseconds).
   * If a consumer does not send a heartbeat within this time, it is considered dead.
   * Default: 30000 (30 seconds)
   */
  sessionTimeout: number;

  /**
   * Kafka auto offset reset policy:
   * - "earliest" (Start reading from the beginning of the topic)
   * - "latest" (Start reading from the newest messages)
   * Default: "latest"
   */
  autoOffsetReset: 'earliest' | 'latest';

  /**
   * Number of retry attempts in case of Kafka failures.
   * Default: 5
   */
  retryAttempts: number;

  /**
   * Maximum number of messages a consumer fetches per request.
   * Default: 10
   */
  maxPollRecords: number;

  /**
   * Minimum bytes to fetch per request.
   * Default: 1
   */
  fetchMinBytes: number;

  /**
   * Maximum time (in milliseconds) Kafka will wait before responding to a fetch request.
   * Default: 500
   */
  fetchMaxWaitMs: number;

  /**
   * Whether to allow automatic partition assignment.
   * Default: true
   */
  enablePartitionAssignment: boolean;

  /**
   * Whether to allow automatic topic creation if the topic does not exist.
   * Default: true
   */
  allowAutoTopicCreation: boolean;

  /**
   * Timeout (in milliseconds) before a consumer request is considered failed.
   * Default: 30000 (30 seconds)
   */
  consumerRequestTimeout: number;

  /**
   * The compression type for Kafka messages.
   * Options: "none", "gzip", "snappy", "lz4", "zstd"
   * Default: "none"
   */
  compressionType: KafkaCompressionType;
};
