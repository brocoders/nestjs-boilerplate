export type CommunicationConfig = {
  /**
   * Whether RabbitMQ is enabled.
   * Default: false
   */
  enableRabbitMQ: boolean;

  /**
   * Whether Kafka is enabled.
   * Default: false
   */
  enableKafka: boolean;

  /**
   * Whether Redis is enabled.
   * Default: false
   */
  enableRedis: boolean;

  /**
   * List of RabbitMQ connection URLs.
   * Example: ["amqp://user:password@rabbitmq-host:5672", "amqp://user:password@backup-host:5672"]
   */
  rabbitmqUrls: string[];

  /**
   * List of RabbitMQ queues.
   * Example: ["order.queue", "payment.queue", "shipping.queue"]
   */
  rabbitmqQueues: string[];

  /**
   * RabbitMQ queue durability (if true, queue will survive server restarts)
   * Default: true
   */
  rabbitmqQueueDurable: boolean;

  /**
   * RabbitMQ prefetch count (number of messages to fetch at a time)
   * Default: 10
   */
  rabbitmqPrefetchCount: number;

  /**
   * RabbitMQ acknowledgment mode (true = auto-ack)
   * Default: true
   */
  rabbitmqNoAck: boolean;

  /**
   * RabbitMQ message persistence (if true, messages will be stored on disk)
   * Default: false
   */
  rabbitmqPersistent: boolean;
};
