import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WebhookEventEmitter } from './events/webhook.event-emitter';
import { WebhookHandlers } from './handlers';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly emitter: WebhookEventEmitter) {}

  async process(
    provider: string,
    body: WebhookRequestDto,
    headers: Record<string, any>,
  ): Promise<WebhookResponseDto> {
    this.logger.debug(`[DEV] Received webhook from provider: ${provider}`);

    const handler = WebhookHandlers[provider];
    if (!handler) {
      this.logger.warn(`No webhook handler found for provider "${provider}"`);
      throw new NotFoundException(
        `No handler found for provider "${provider}"`,
      );
    }

    const { type, data } = await handler.parse(body, headers);

    const eventKey = `${provider}.${type}`;
    const listenerCount = this.emitter.listenerCount(eventKey);

    if (listenerCount === 0) {
      this.logger.warn(
        `No listeners registered for event: ${eventKey}. The event was received but will not trigger any action.`,
      );
    } else {
      this.logger.debug(`Emitting internal event: ${eventKey}`);
      this.emitter.emit(eventKey, data);
    }

    return { status: 'received' };
  }
}
