import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions } from '@nestjs/microservices';
import {
  createRabbitMQBaseOptions,
  updateRabbitMQOptions,
} from './config/rabbitmq.option';
import {
  RMQ_EXCHANGES,
  RMQ_QUEUES,
  RMQ_ROUTING_KEYS,
} from './rabbitmq.bindings';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private isInitialized = false;

  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  initialize(app: INestApplication) {
    if (this.isInitialized) {
      this.logger.warn('RabbitMQ is already initialized.');
      return;
    }

    const enableRabbitMQ =
      this.configService.get<boolean>('rabbitMQ.enableRabbitMQ', {
        infer: true,
      }) ?? false;
    if (!enableRabbitMQ) {
      this.logger.warn('RabbitMQ is disabled. Skipping initialization.');
      return;
    }

    this.logger.log('Initializing RabbitMQ consumers...');

    const baseRabbitMQOptions: RmqOptions = createRabbitMQBaseOptions(
      this.configService,
    );

    for (const [exchangeName, routingKeySet] of Object.entries(
      RMQ_ROUTING_KEYS,
    )) {
      if (!(exchangeName in RMQ_EXCHANGES)) {
        this.logger.warn(
          `Exchange "${exchangeName}" is missing from RMQ_EXCHANGES. Skipping.`,
        );
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [routingKey, routingValue] of Object.entries(routingKeySet)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [queueKey, queueValue] of Object.entries(RMQ_QUEUES)) {
          const rabbitMQOptions: RmqOptions = updateRabbitMQOptions(
            baseRabbitMQOptions,
            {
              queueName: queueValue,
              exchangeName: RMQ_EXCHANGES[exchangeName],
              routingKey: routingValue,
            },
          );

          app.connectMicroservice<RmqOptions>(rabbitMQOptions);
          this.logger.debug(
            `Registered Queue: ${queueValue} | Exchange: ${RMQ_EXCHANGES[exchangeName]} | Routing Key: ${routingValue}`,
          );
        }
      }
    }

    this.isInitialized = true;
  }
}
