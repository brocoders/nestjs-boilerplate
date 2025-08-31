import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import type { ServerOptions, Server as SocketIOServer } from 'socket.io';

type RedisClient = ReturnType<typeof createClient>;

let _adapter: RedisIoAdapter | null = null;

/**
 * Minimal Redis-backed Socket.IO adapter with a bootstrap helper.
 * Usage (in main.ts):
 *
 *   const app = await NestFactory.create(AppModule);
 *   await bootstrapSocketIoRedis(app); // reads REDIS_URL or defaults to localhost
 *   await app.listen(process.env.PORT || 3000);
 */

class RedisIoAdapter extends IoAdapter {
  private pubClient!: RedisClient;
  private subClient!: RedisClient;

  constructor(
    app: INestApplication,
    pubClient: RedisClient,
    subClient: RedisClient,
  ) {
    super(app);
    this.pubClient = pubClient;
    this.subClient = subClient;
  }

  override createIOServer(
    port: number,
    options?: ServerOptions,
  ): SocketIOServer {
    const server: SocketIOServer = super.createIOServer(port, {
      ...options,
      cors: { origin: true, credentials: true, ...(options?.cors || {}) },
      transports: options?.transports ?? ['websocket'],
    });
    server.adapter(createAdapter(this.pubClient, this.subClient));
    return server;
  }

  async close(): Promise<void> {
    // Graceful shutdown of Redis clients
    await Promise.allSettled([this.pubClient?.quit(), this.subClient?.quit()]);
  }
}

/**
 * Bootstrap the Redis adapter for Socket.IO.
 * - Reads REDIS_URL from env if no url is provided.
 * - Must be called before app.listen().
 */
export async function bootstrapSocketIoRedis(
  app: INestApplication,
  url?: string,
): Promise<RedisIoAdapter> {
  if (_adapter) return _adapter; // idempotent

  const redisUrl = url || process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    const adapter = new RedisIoAdapter(app, pubClient, subClient);
    app.useWebSocketAdapter(adapter);

    _adapter = adapter;
    return adapter;
  } catch (err) {
    // Provide a clearer error so misconfig is obvious at startup
    const reason = (err as Error)?.message || String(err);
    throw new Error(
      `Failed to bootstrap Socket.IO Redis adapter. URL: ${redisUrl}. Reason: ${reason}`,
    );
  }
}

export function isSocketIoRedisBootstrapped(): boolean {
  return !!_adapter;
}

export async function closeSocketIoRedis(): Promise<void> {
  if (_adapter) {
    await _adapter.close();
    _adapter = null;
  }
}
