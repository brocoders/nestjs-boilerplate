import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

/**
 * SocketServerProvider
 * --------------------
 * Holds the live Socket.IO Server instance so you can inject it anywhere
 * (without importing the Gateway). The Gateway should call setServer() in
 * afterInit(). Other services can access the instance via the `server` getter.
 */
@Injectable()
export class SocketServerProvider {
  private _server?: Server;

  /** Bind the live Server instance (call from the Gateway's afterInit). */
  setServer(server: Server): void {
    this._server = server;
  }

  /** Retrieve the live Server instance or throw if not initialized yet. */
  get server(): Server {
    if (!this._server) {
      throw new Error(
        'Socket.IO server is not initialized yet. Call setServer() in your gateway afterInit().',
      );
    }
    return this._server;
  }
}
