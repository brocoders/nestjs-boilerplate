import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';
import { ServerOptions, Server as SocketIOServer } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private pubClient!: RedisClientType;
  private subClient!: RedisClientType;

  constructor(private app: INestApplication) {
    super(app);
  }

  /** Call this once during bootstrap (before app.useWebSocketAdapter). */
  async connectToRedis(): Promise<void> {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.pubClient = createClient({ url });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
  }

  /** Applies the Redis adapter to the created Socket.IO server. */
  override createIOServer(
    port: number,
    options?: ServerOptions,
  ): SocketIOServer {
    const server: SocketIOServer = super.createIOServer(port, {
      ...options,
      cors: { origin: true, credentials: true, ...(options?.cors || {}) },
      transports: options?.transports ?? ['websocket'], // stay consistent with Step 1
    });

    server.adapter(createAdapter(this.pubClient, this.subClient));
    return server;
  }
}
