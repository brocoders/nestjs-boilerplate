import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import type { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/users/domain/user';
import {
  WsError,
  WsErrorCode,
} from 'src/communication/socketio/types/socketio-error.type';

@Injectable()
export class SocketIoAuthService {
  constructor(private readonly authService: AuthService) {}

  /**
   * Authenticate a Socket.IO connection using the app's AuthService.
   * - Extracts the access token from handshake (auth.token or Authorization header).
   * - Delegates validation to AuthService.validateSocketToken.
   * - Attaches the resolved User to socket.data.user and returns it.
   * - Throws specific UnauthorizedException messages for missing/expired/invalid tokens.
   */
  async authenticateSocket(socket: Socket): Promise<User> {
    const token = this.extractToken(socket);

    try {
      const user = await this.authService.validateSocketToken(token);
      socket.data.user = user; // make user available to guards/handlers
      return user;
    } catch (err: any) {
      this.handleAuthError(err, socket);
    }
  }

  /**
   * Re-authenticate an already connected socket (e.g., after token refresh)
   * without disconnecting the client.
   */
  async reAuthenticate(socket: Socket, nextToken: string): Promise<User> {
    try {
      const user = await this.authService.validateSocketToken(nextToken);
      socket.data.user = user;
      return user;
    } catch (err: any) {
      this.handleAuthError(err, socket);
    }
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

    if (header && header.length > 0) {
      return header.startsWith('Bearer ') ? header.slice(7).trim() : header;
    }

    // Mark the reason for consumers (optional)
    socket.data.wsAuthError = { reason: WsError.JWT_MISSING.code } as {
      reason: WsErrorCode;
    };
    throw new UnauthorizedException('[WS] JWT token does not exist');
  }

  /**
   * Normalize and rethrow auth errors with explicit reasons/messages that the caller can map.
   * We don’t import jsonwebtoken types directly; instead we rely on `name`/`message` to classify.
   */
  private handleAuthError(err: any, socket: Socket): never {
    const name = err?.name || '';
    const message = (err?.message as string) || '';

    // Common error names from jsonwebtoken / Nest wrappers
    // TokenExpiredError: token expired
    if (name === 'TokenExpiredError' || /expired/i.test(message)) {
      socket.data.wsAuthError = { reason: WsError.JWT_EXPIRED.code } as {
        reason: WsErrorCode;
      };
      throw new UnauthorizedException('[WS] JWT token expired');
    }

    // NotBeforeError: token is not yet valid (nbf)
    if (
      name === 'NotBeforeError' ||
      /not\s*active|not\s*before/i.test(message)
    ) {
      socket.data.wsAuthError = { reason: WsError.JWT_NOT_ACTIVE.code } as {
        reason: WsErrorCode;
      };
      throw new UnauthorizedException('[WS] JWT token not active yet');
    }

    // JsonWebTokenError or other validation/signature issues
    if (
      name === 'JsonWebTokenError' ||
      /invalid|malformed|signature/i.test(message)
    ) {
      socket.data.wsAuthError = { reason: WsError.JWT_INVALID.code } as {
        reason: WsErrorCode;
      };
      throw new UnauthorizedException('[WS] JWT token not valid');
    }

    // Some apps raise Forbidden for disabled users/roles after token validation
    if (err instanceof ForbiddenException) {
      socket.data.wsAuthError = { reason: WsError.JWT_FORBIDDEN.code } as {
        reason: WsErrorCode;
      };
      throw err; // keep original Forbidden
    }

    // Fallback: unknown auth error
    socket.data.wsAuthError = { reason: WsError.AUTH_UNKNOWN_ERROR.code } as {
      reason: WsErrorCode;
    };
    throw new UnauthorizedException('[WS] Authentication failed');
  }
}
