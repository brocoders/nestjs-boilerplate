import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

/**
 * SocketServerProvider
 * --------------------
 * Holds the live Socket.IO Server instance so you can inject it anywhere
 * (without importing the Gateway). The Gateway should call setServer() in
 * afterInit(). Other services (like BaseMarketFeedService) can access it
 * via `getServer()` safely.
 */
@Injectable()
export class SocketServerProvider {
  private _server?: Server;

  /** Bind the live Server instance (call from the Gateway's afterInit). */
  setServer(server: Server): void {
    this._server = server;
  }

  /**
   * Strict getter. Throws if not initialized.
   * Use only if you *require* the server to exist.
   */
  get server(): Server {
    if (!this._server) {
      throw new Error(
        'Socket.IO server is not initialized yet. Call setServer() in your gateway afterInit().',
      );
    }
    return this._server;
  }

  /**
   * Safe accessor.
   * Returns the live server instance if available, otherwise undefined.
   * Use this in background services (like market feeds) that may emit
   * conditionally, without crashing the app if the server isn’t ready yet.
   */
  getServer(): Server | undefined {
    return this._server;
  }

  /**
   * Quick check if the server is initialized.
   */
  get isReady(): boolean {
    return !!this._server;
  }
}
