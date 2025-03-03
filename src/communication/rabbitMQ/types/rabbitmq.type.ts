// RabbitMQ Default Settings
export const RMQ_QUEUE_DURABLE: boolean = true;
export const RMQ_PREFETCH_COUNT: number = 10;
export const RMQ_NO_ACK: boolean = false; // Changed to `false` for manual acknowledgment (best practice)
export const RMQ_PERSISTENT: boolean = true; // Changed to `true` for message durability (important for critical services)

// RabbitMQ Default Communication URLs (Static)
export const RMQ_DEFAULT_COMMUNICATION_URLS: string[] = [
  'amqp://localhost:5672',
];

// RabbitMQ Exchanges (Static)
export const RMQ_EXCHANGES: Record<string, string> = {
  orders: 'orders_exchange',
  inventory: 'inventory_exchange',
};

// RabbitMQ Queues (Static)
export const RMQ_QUEUES: Record<string, string> = {
  order: 'order_service_queue',
  inventory: 'inventory_service_queue',
};

// RabbitMQ Routing Keys (Static)
export const RMQ_ROUTING_KEYS: Record<string, Record<string, string>> = {
  orders: {
    created: 'order.created',
    updated: 'order.updated',
  },
  inventory: {
    stockUpdated: 'inventory.stock.updated',
  },
};

// Default Queue (Used if no queue name is provided)
export const RMQ_DEFAULT_QUEUE: string = RMQ_QUEUES.orderServiceQueue; // Set default to `order_service_queue`
