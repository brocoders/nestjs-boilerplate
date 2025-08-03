import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import chalk from 'chalk';

import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { WebhookEventEmitter } from './events/webhook.event-emitter';
import { webhookCorsMiddleware } from './webhook-cors.middleware';
import { WebhookHandlers } from './handlers';

@Module({
  imports: [EventEmitterModule.forRoot()],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookEventEmitter],
})
export class WebhooksModule implements NestModule, OnModuleInit {
  private readonly logger = new Logger(WebhooksModule.name);

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(webhookCorsMiddleware).forRoutes('api/webhooks/:provider');
  }

  onModuleInit() {
    const providerList = Object.keys(WebhookHandlers);

    this.logger.log('Webhook system initialized');
    this.logger.debug(
      `Listening for ${chalk.bold.green('POST')} requests on: ${chalk.cyanBright('/api/webhooks/:provider')}`,
    );
    this.logger.debug(
      `Supported providers: ${chalk.yellow(providerList.join(', '))}`,
    );
  }
}
