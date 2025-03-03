// RabbitMQ Exchanges (Static)
export const RMQ_EXCHANGES: Record<string, string> = {
  orders: 'orders.exchange.topic',
  inventory: 'inventory.exchange.topic',
};

// RabbitMQ Queues (Static)
export const RMQ_QUEUES: Record<string, string> = {
  orderProcessing: 'order-processing.queue',
  orderUpdated: 'order-updated.queue',
  inventoryUpdate: 'inventory-update.queue',
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
