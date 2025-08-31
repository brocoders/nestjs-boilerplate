import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/domain/user';

@Injectable()
export class SocketIoAuthService {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate a Socket.IO connection using the app's AuthService.
   * - Extracts the access token from handshake (auth.token or Authorization header).
   * - Delegates validation to AuthService.validateSocketToken.
   * - Attaches the resolved User to socket.data.user and returns it.
   */
  async authenticateSocket(socket: Socket): Promise<User> {
    const token = this.extractToken(socket);
    const user = await this.authService.validateSocketToken(token);
    socket.data.user = user; // make user available to guards/handlers
    return user;
  }

  /**
   * Re-authenticate an already connected socket (e.g., after token refresh)
   * without disconnecting the client.
   */
  async reAuthenticate(socket: Socket, nextToken: string): Promise<User> {
    const user = await this.authService.validateSocketToken(nextToken);
    socket.data.user = user;
    return user;
  }

  /**
   * Extract token from either handshake.auth.token or Authorization header.
   */
  private extractToken(socket: Socket): string {
    // 1) handshake.auth.token
    const raw =
      typeof socket.handshake.auth?.token === 'string'
        ? socket.handshake.auth.token.trim()
        : undefined;

    if (raw && raw.length > 0) {
      return raw.startsWith('Bearer ') ? raw.slice(7).trim() : raw;
    }

    // 2) Authorization header
    const header = (
      socket.handshake.headers['authorization'] as string | undefined
    )?.trim();
    if (header) {
      return header.startsWith('Bearer ') ? header.slice(7).trim() : header;
    }

    throw new UnauthorizedException('[WS] Token not provided');
  }
}
