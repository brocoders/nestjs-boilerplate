import { INestApplication, Logger } from '@nestjs/common';
import { WebhookEventEmitter } from './events/webhook.event-emitter';

/**
 * Registers test webhook listeners from inside the application context.
 * This function pulls the WebhookEventEmitter via app.get().
 *
 * @param app NestJS application instance
 */
export function registerTestWebhookListeners(app: INestApplication): void {
  const logger = new Logger('TestWebhookListener');
  const emitter = app.get(WebhookEventEmitter);

  emitter.on('test.TEST_EVENT', (payload) => {
    logger.log('Received test.TEST_EVENT');
    logger.debug(`Payload: ${JSON.stringify(payload, null, 2)}`);
  });
}
