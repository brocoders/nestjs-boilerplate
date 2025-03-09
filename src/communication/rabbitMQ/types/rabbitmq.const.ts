// RabbitMQ Default Settings
export const RMQ_QUEUE_DURABLE: boolean = true;
export const RMQ_PREFETCH_COUNT: number = 10;
export const RMQ_NO_ACK: boolean = false; // Changed to `false` for manual acknowledgment (best practice)
export const RMQ_PERSISTENT: boolean = true; // Changed to `true` for message durability (important for critical services)

// RabbitMQ Default Communication URLs (Static)
export const RMQ_DEFAULT_COMMUNICATION_URLS: string[] = [
  'amqp://localhost:5672',
];

// Default Queue (Used if no queue name is provided)
export const RMQ_DEFAULT_QUEUE: string = 'main-queue'; // Set default to `order_service_queue`
