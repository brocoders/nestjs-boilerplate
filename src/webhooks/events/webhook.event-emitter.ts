import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class WebhookEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit a webhook event with type and data.
   * @param event The full event name (e.g., 'test.TEST_EVENT')
   * @param data The payload to broadcast
   * @returns True if the event had listeners, false otherwise
   */
  emit(event: string, data: any): boolean {
    return this.eventEmitter.emit(event, data);
  }

  /**
   * Register a listener for a specific webhook event.
   * @param event The full event name (e.g., 'test.TEST_EVENT')
   * @param listener Callback function to execute when the event is triggered
   */
  on<T = any>(event: string, listener: (data: T) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Remove a previously registered listener.
   * @param event The event name
   * @param listener The function to remove
   */
  off<T = any>(event: string, listener: (data: T) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Get the number of listeners registered for a specific event.
   * @param event The full event name
   * @returns Number of listeners
   */
  listenerCount(event: string): number {
    return this.eventEmitter.listenerCount(event);
  }
}
