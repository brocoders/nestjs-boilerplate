export const RMQ_QUEUE_DURABLE: boolean = true;
export const RMQ_PREFETCH_COUNT: number = 10;
export const RMQ_NO_ACK: boolean = true;
export const RMQ_DEFAULT_QUEUES: string[] = ['main-queue'];
export const RMQ_PERSISTENT: boolean = false;
export const RMQ_DEFAULT_COMMUNICATION_URLS: string[] = [
  'amqp://localhost:5672',
];
