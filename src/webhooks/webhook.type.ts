export interface TestWebhookInput {
  event?: string;
  payload?: Record<string, any>;
}

export interface WebhookHandler {
  parse: (
    body: any,
    headers: Record<string, any>,
  ) => Promise<{
    type: string;
    data: Record<string, any>;
  }>;
}

export interface ParsedWebhookEvent {
  type: string;
  data: Record<string, any>;
}
