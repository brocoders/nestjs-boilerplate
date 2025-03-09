import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaOptions, Transport } from '@nestjs/microservices';
import { ConsumerConfig, ConsumerSubscribeTopics } from 'kafkajs';
import {
  KAFKA_DEFAULT_BROKERS,
  KAFKA_DEFAULT_CLIENT_ID,
  KAFKA_DEFAULT_GROUP_ID,
  KAFKA_DEFAULT_AUTO_COMMIT,
  KAFKA_DEFAULT_SESSION_TIMEOUT,
  KAFKA_DEFAULT_AUTO_OFFSET_RESET,
  KAFKA_DEFAULT_RETRY_ATTEMPTS,
  KAFKA_DEFAULT_FETCH_MIN_BYTES,
  KAFKA_DEFAULT_FETCH_MAX_WAIT_MS,
  KAFKA_DEFAULT_ALLOW_AUTO_TOPIC_CREATION,
} from './types/kafka.const';
import { KAFKA_TOPICS } from './kafak.bindings';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);
  private isInitialized = false;

  constructor(private readonly configService: ConfigService) {}

  initialize(app: INestApplication) {
    if (this.isInitialized) {
      this.logger.warn('Kafka is already initialized.');
      return;
    }

    const enableKafka =
      this.configService.get('kafka.enableKafka', { infer: true }) ?? false;

    if (!enableKafka) {
      this.logger.warn('Kafka is disabled. Skipping initialization.');
      return;
    }

    this.logger.log('Initializing Kafka consumer...');

    // Create Kafka consumer options
    const kafkaOptions: KafkaOptions = this.createKafkaOptions();

    // Register Kafka microservice
    app.connectMicroservice<KafkaOptions>(kafkaOptions);

    this.logger.log(
      `Kafka Consumer registered with Group ID: ${KAFKA_DEFAULT_GROUP_ID}`,
    );

    for (const topic of Object.values(KAFKA_TOPICS)) {
      this.logger.debug(`Subscribed to Kafka Topic: ${topic}`);
    }

    this.isInitialized = true;
  }

  private createKafkaOptions(): KafkaOptions {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId:
            this.configService.get('kafka.kafkaClientId', { infer: true }) ??
            KAFKA_DEFAULT_CLIENT_ID,
          brokers:
            this.configService.get('kafka.kafkaBrokers', { infer: true }) ??
            KAFKA_DEFAULT_BROKERS,
        },
        consumer: {
          groupId: KAFKA_DEFAULT_GROUP_ID,
          allowAutoTopicCreation:
            this.configService.get('kafka.allowAutoTopicCreation', {
              infer: true,
            }) ?? KAFKA_DEFAULT_ALLOW_AUTO_TOPIC_CREATION,
          autoCommit:
            this.configService.get('kafka.autoCommit', { infer: true }) ??
            KAFKA_DEFAULT_AUTO_COMMIT,
          sessionTimeout:
            this.configService.get('kafka.sessionTimeout', { infer: true }) ??
            KAFKA_DEFAULT_SESSION_TIMEOUT,
          retryAttempts:
            this.configService.get('kafka.retryAttempts', { infer: true }) ??
            KAFKA_DEFAULT_RETRY_ATTEMPTS,
          autoOffsetReset:
            this.configService.get('kafka.autoOffsetReset', { infer: true }) ??
            KAFKA_DEFAULT_AUTO_OFFSET_RESET,
          fetchMinBytes:
            this.configService.get('kafka.fetchMinBytes', { infer: true }) ??
            KAFKA_DEFAULT_FETCH_MIN_BYTES,
          fetchMaxWaitMs:
            this.configService.get('kafka.fetchMaxWaitMs', { infer: true }) ??
            KAFKA_DEFAULT_FETCH_MAX_WAIT_MS,
        } as ConsumerConfig,
        subscribe: {
          fromBeginning: false,
        } as ConsumerSubscribeTopics,
      },
    };
  }
}
