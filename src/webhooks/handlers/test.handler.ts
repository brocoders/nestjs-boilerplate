/* eslint-disable @typescript-eslint/require-await */
import { ParsedWebhookEvent, TestWebhookInput } from '../webhook.type';

export const TestWebhookHandler = {
  /**
   * Parses the incoming test webhook request into a standard event format.
   * @param body - The incoming request body from the POST call
   * @param headers - The request headers (unused for now)
   * @returns ParsedWebhookEvent with normalized event type and payload
   */
  async parse(
    body: TestWebhookInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    headers: Record<string, any>,
  ): Promise<ParsedWebhookEvent> {
    const type = typeof body.event === 'string' ? body.event : 'TEST_EVENT';
    const data =
      body.payload && typeof body.payload === 'object' ? body.payload : {};

    return { type, data };
  },
};
