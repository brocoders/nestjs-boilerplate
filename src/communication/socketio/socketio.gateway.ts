//import { metrics } from './utils/metrics'; // Ensure you have a metrics utility

import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoggerService } from '../../common/logger/logger.service';
import { LoggerSocketIoPlugin } from '../../common/logger/plugins/logger-socketio.plugin';
import { SocketIoReAuthDto } from './dto/socketio-auth.dto';
import { Server, Socket } from 'socket.io';
import { SocketIoAuthService } from './services/socketio.auth.service';
import { SocketIoRoleGuard } from './guards/socketio-role.guard';
import { SocketServerProvider } from './utils/socketio.provider';
import { getEnumText } from '../../utils/helpers/enum.helper';
import { RoleEnum } from '../../roles/roles.enum';
import { WsEvent } from './types/socketio-event.type';
import { WsError, WsErrorCode } from './types/socketio-error.type';
import { CHANNELS } from './types/socketio-enum.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../../config/config.type';
import {
  SOCKETIO_DEFAULT_PING_INTERVAL,
  SOCKETIO_DEFAULT_PING_TIMEOUT,
  SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
  SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
  SOCKETIO_DEFAULT_NAMESPACE,
  DISCONNET_TIMEOUT_MS,
} from './types/socketio-const.type';

@WebSocketGateway({
  namespace: SOCKETIO_DEFAULT_NAMESPACE,
  cors: { origin: true, credentials: true },
  transports: ['websocket'],
  pingInterval: SOCKETIO_DEFAULT_PING_INTERVAL,
  pingTimeout: SOCKETIO_DEFAULT_PING_TIMEOUT,
  maxHttpBufferSize: SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly pingInterval = this.config.get(
    'socketIO.pingInterval',
    SOCKETIO_DEFAULT_PING_INTERVAL,
    { infer: true },
  );
  private readonly pingTimeout = this.config.get(
    'socketIO.pingTimeout',
    SOCKETIO_DEFAULT_PING_TIMEOUT,
    { infer: true },
  );
  private readonly maxHttpBufferSize = this.config.get(
    'socketIO.maxHttpBufferSize',
    SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
    { infer: true },
  );
  private readonly defaultReauthGraceMs = this.config.get(
    'socketIO.defaultReauthGraceMs',
    SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
    { infer: true },
  );
  private readonly maxReauthTries = this.config.get(
    'socketIO.maxReauthTries',
    SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
    { infer: true },
  );

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly config: ConfigService<AllConfigType>,
    private readonly auth: SocketIoAuthService,
    private readonly serverRef: SocketServerProvider,
    private readonly logger: LoggerService,
  ) {}

  /** Sleep helper to ensure emits flush before disconnect */
  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms)));
  }

  /** Mark current socket token as expired and open a re-auth grace window */
  public markTokenExpired(socket: Socket, graceMs = this.defaultReauthGraceMs) {
    const now = Date.now();
    socket.data.reauthUntil = now + graceMs;
    socket.data.reauthTries = 0;
    this.emitWsError(
      socket,
      WsError.JWT_EXPIRED.code,
      WsError.JWT_EXPIRED.message,
      {
        expiresAt: socket.data.reauthUntil,
        maxTries: this.maxReauthTries,
        graceMs,
      },
    );
  }

  /** Compute approximate JSON payload size in bytes */
  private sizeOf(payload: unknown): number {
    try {
      return Buffer.byteLength(JSON.stringify(payload || {}));
    } catch {
      return 0;
    }
  }

  /** Map auth-service reason keys to WsError codes/messages */
  private mapAuthReasonToWsError(reason?: WsErrorCode): {
    code: string;
    message: string;
  } {
    switch (reason) {
      case WsError.JWT_MISSING.code:
        return {
          code: WsError.JWT_MISSING.code,
          message: WsError.JWT_MISSING.message,
        };
      case WsError.JWT_EXPIRED.code:
        return {
          code: WsError.JWT_EXPIRED.code,
          message: WsError.JWT_EXPIRED.message,
        };
      case WsError.JWT_INVALID.code:
        return {
          code: WsError.JWT_INVALID.code,
          message: WsError.JWT_INVALID.message,
        };
      case WsError.JWT_NOT_ACTIVE.code:
        return {
          code: WsError.JWT_NOT_ACTIVE.code,
          message: WsError.JWT_NOT_ACTIVE.message,
        };
      case WsError.JWT_FORBIDDEN.code:
        return {
          code: WsError.FORBIDDEN.code,
          message: WsError.FORBIDDEN.message,
        };
      case WsError.AUTH_UNKNOWN_ERROR.code:
      default:
        return {
          code: WsError.UNAUTHORIZED.code,
          message: WsError.UNAUTHORIZED.message,
        };
    }
  }

  /** Emit a structured Socket.IO error back to the client */
  private emitWsError(
    socket: Socket,
    code: string,
    message: string,
    extra?: Record<string, unknown>,
  ) {
    const payload = { code, message, ...(extra || {}) };
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const adminPayload = {
      ...payload,
      ns: ctx.ns,
      sid: ctx.sid,
      ip: ctx.ip,
      userId: ctx.userId,
    };

    // Server-side error log
    this.logger.error(
      `[WS][ERROR] code=${code} msg="${message}" ns=${ctx.ns} sid=${ctx.sid} ip=${ctx.ip} userId=${ctx.userId}`,
      undefined,
      SocketIoGateway.name,
    );

    // 1) Emit to the specific client (both legacy and new channels)
    try {
      socket.nsp.to(socket.id).emit(WsEvent.ERROR.value, payload);
    } catch (err) {
      this.logger.debug(
        `nsp.emit(ws.error) failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
    try {
      socket.emit(WsEvent.ERROR.value, payload);
    } catch (err) {
      this.logger.debug(
        `socket.emit(ws.error) failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
    // New log/error channel for the same client
    try {
      socket.emit(CHANNELS.LOG_ERROR, payload);
    } catch (err) {
      this.logger.debug(
        `socket.emit(logs:error) failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }

    // 2) Emit to the per-user room (if we know the user)
    const uid = socket.data?.user?.id ? String(socket.data.user.id) : undefined;
    if (uid) {
      const userRoom = `user:${uid}`;
      try {
        this.server.to(userRoom).emit(CHANNELS.LOG_ERROR, payload);
      } catch (err) {
        this.logger.debug(
          `server.to(userRoom).emit(logs:error) failed: ${(err as Error)?.message}`,
          SocketIoGateway.name,
        );
      }
    }

    // 3) Emit rich error to admins
    try {
      this.server.to('role:admin').emit(CHANNELS.LOG_ERROR, adminPayload);
    } catch (err) {
      this.logger.debug(
        `server.to(role:admin).emit(logs:error) failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
  }

  /** Emit ws.error, then disconnect after a small delay so the client receives the error */
  private async disconnectWithNotice(
    socket: Socket,
    code: string,
    message: string,
    extra?: Record<string, unknown>,
    delayMs = DISCONNET_TIMEOUT_MS,
  ) {
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    try {
      this.emitWsError(socket, code, message, extra);
    } catch (err) {
      this.logger.debug(
        `Failed to emit pre-disconnect ws.error: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
    // optional courtesy event (standardized to "disconnect: incoming")
    try {
      socket.emit(CHANNELS.DISCONNECT_INCOMING, { inMs: delayMs });
    } catch (err) {
      this.logger.debug(
        `emit disconnect:incoming failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
    // Server-side warn about upcoming disconnect
    this.logger.warn(
      `[WS][WILL_DISCONNECT] ns=${ctx.ns} sid=${ctx.sid} ip=${ctx.ip} inMs=${delayMs}`,
      SocketIoGateway.name,
    );
    try {
      this.server.to('role:admin').emit(CHANNELS.LOG_WARN, {
        event: 'willDisconnect',
        ns: ctx.ns,
        sid: ctx.sid,
        inMs: delayMs,
      });
    } catch {}
    await this.sleep(delayMs);
    try {
      socket.disconnect(true);
    } catch (e) {
      this.logger.debug(
        `Failed to force disconnect: ${(e as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
  }

  afterInit() {
    this.serverRef.setServer(this.server);
    // Apply runtime Socket.IO options from config
    try {
      // Note: these are creation-time options, but setting here keeps values in sync and is safe for logging/visibility
      (this.server as any).opts = {
        ...(this.server as any).opts,
        pingInterval: this.pingInterval,
        pingTimeout: this.pingTimeout,
        maxHttpBufferSize: this.maxHttpBufferSize,
      };
      this.logger.debug(
        `Applied Socket.IO opts: pingInterval=${this.pingInterval}ms, pingTimeout=${this.pingTimeout}ms, maxHttpBufferSize=${this.maxHttpBufferSize}`,
        SocketIoGateway.name,
      );
    } catch (e) {
      this.logger.warn(
        `Could not apply Socket.IO opts at runtime: ${(e as Error)?.message}`,
        SocketIoGateway.name,
      );
    }

    const ctx = LoggerSocketIoPlugin.extractInitContext(this.server);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      SocketIoGateway.name,
      ctx.ns,
      '-',
      '-',
      '-',
      '-',
      'gateway.init',
      0,
      0,
    );
    this.logger.log(line, SocketIoGateway.name);

    // Surface clear reasons to clients during handshake (connect_error)
    // Note: with a namespaced gateway, `@WebSocketServer()` injects a Namespace, not the root Server.
    const nsp: any = this.server; // Namespace instance for '/ws'
    if (typeof nsp.use === 'function') {
      // eslint-disable-next-line @typescript-eslint/require-await
      nsp.use(async (socket: Socket, next: (err?: Error) => void) => {
        const authToken =
          (socket.handshake.auth?.token as string) ||
          (socket.handshake.headers?.authorization as string)?.replace(
            /^Bearer\s+/i,
            '',
          );

        if (!authToken) {
          const err: any = new Error('[WS] Missing JWT token');
          err.data = {
            code: WsError.JWT_MISSING.code,
            message: WsError.JWT_MISSING.message,
          };
          this.logger.warn(
            `[WS][CONNECT_ERROR] Missing JWT token ns=${socket.nsp?.name ?? '/'} sid=${socket.id} ip=${socket.handshake?.address || ''}`,
            SocketIoGateway.name,
          );
          return next(err);
        }
        return next();
      });
    }
  }

  async handleConnection(socket: Socket) {
    (socket as any)['__startTime'] = Date.now();
    try {
      const token =
        (socket.handshake.auth?.token as string) ||
        (socket.handshake.headers?.authorization as string)?.replace(
          /^Bearer\s+/i,
          '',
        );

      const user = token ? await this.auth.authenticateSocket(socket) : null;

      socket.data.connectedAt = Date.now();

      if (user) {
        await socket.join(`user:${user.id}`);
        // Join role-scoped room so admins can receive fleet logs
        const roleText =
          getEnumText(RoleEnum, user?.role?.id ?? user?.role) ??
          getEnumText(RoleEnum, RoleEnum.user) ??
          'user';
        const roleName = roleText.toLowerCase();
        await socket.join(`role:${roleName}`);

        // Inform this user and admins about the connection (sanitized for user)
        try {
          socket.emit(CHANNELS.LOG_INFO, { event: 'connect', sid: socket.id });
        } catch (err) {
          this.logger.debug(
            `socket.emit(logs:info) failed: ${(err as Error)?.message}`,
            SocketIoGateway.name,
          );
        }
        try {
          const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
          this.server.to('role:admin').emit(CHANNELS.LOG_INFO, {
            event: 'connect',
            ns: ctx.ns,
            sid: ctx.sid,
            ip: ctx.ip,
            userId: String(user.id),
            role: roleName,
          });
        } catch (err) {
          this.logger.debug(
            `server.to(role:admin).emit(logs:info) failed: ${(err as Error)?.message}`,
            SocketIoGateway.name,
          );
        }

        const role =
          getEnumText(RoleEnum, user?.role?.id ?? user?.role) ||
          getEnumText(RoleEnum, RoleEnum.user);
        const authOk = LoggerSocketIoPlugin.formatAuthLogContext(
          SocketIoGateway.name,
          socket.nsp?.name ?? '/',
          socket.id,
          socket.handshake?.address || '',
          String(user.id),
          role,
          true,
        );
        this.logger.log(authOk, SocketIoGateway.name);
      } else {
        const authFail = LoggerSocketIoPlugin.formatAuthLogContext(
          SocketIoGateway.name,
          socket.nsp?.name ?? '/',
          socket.id,
          socket.handshake?.address || '',
          'anonymous',
          'guest',
          false,
          'no token',
        );
        this.logger.warn(authFail, SocketIoGateway.name);
        this.logger.warn(
          `[WS][CONNECT_ERROR] code=${WsError.UNAUTHORIZED.code} msg="${WsError.UNAUTHORIZED.message}" ns=${socket.nsp?.name ?? '/'} sid=${socket.id} ip=${socket.handshake?.address || ''}`,
          SocketIoGateway.name,
        );
        try {
          const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
          this.server.to('role:admin').emit(CHANNELS.CONNECT_ERROR, {
            code: WsError.UNAUTHORIZED.code,
            message: WsError.UNAUTHORIZED.message,
            ns: ctx.ns,
            sid: ctx.sid,
            ip: ctx.ip,
          });
        } catch {}
        try {
          // Also notify the client on the standardized "connect:error" channel
          socket.emit(CHANNELS.CONNECT_ERROR, {
            code: WsError.UNAUTHORIZED.code,
            message: WsError.UNAUTHORIZED.message,
          });
        } catch (err) {
          this.logger.debug(
            `socket.emit(connect:error) failed: ${(err as Error)?.message}`,
            SocketIoGateway.name,
          );
        }
        await this.disconnectWithNotice(
          socket,
          WsError.UNAUTHORIZED.code,
          WsError.UNAUTHORIZED.message,
        );
        return;
      }

      const role =
        getEnumText(
          RoleEnum,
          socket.data?.user?.role?.id ?? socket.data?.user?.role,
        ) || getEnumText(RoleEnum, RoleEnum.user);
      const connLine = LoggerSocketIoPlugin.formatConnectLogContext(
        SocketIoGateway.name,
        socket.nsp?.name ?? '/',
        socket.id,
        socket.handshake?.address || '',
        String(socket.data?.user?.id ?? 'unknown'),
        role,
        Date.now() - (socket as any)['__startTime'],
      );
      this.logger.log(connLine, SocketIoGateway.name);
    } catch (err) {
      const role =
        getEnumText(
          RoleEnum,
          socket.data?.user?.role?.id ?? socket.data?.user?.role,
        ) || getEnumText(RoleEnum, RoleEnum.user);
      const failLine = LoggerSocketIoPlugin.formatAuthLogContext(
        SocketIoGateway.name,
        socket.nsp?.name ?? '/',
        socket.id,
        socket.handshake?.address || '',
        String(socket.data?.user?.id ?? 'unknown'),
        role,
        false,
        (err as Error)?.message,
      );
      this.logger.error(failLine, undefined, SocketIoGateway.name);

      const reason = (socket.data as any)?.wsAuthError?.reason as
        | string
        | undefined;
      // Best effort: infer when service couldn't set reason
      const msg = (err as Error)?.message || '';
      const inferred: WsErrorCode | undefined =
        (reason as WsErrorCode | undefined) ||
        (/jwt\s*expired|TokenExpiredError/i.test(msg)
          ? (WsError.JWT_EXPIRED.code as WsErrorCode)
          : /not\s*active|not\s*before/i.test(msg)
            ? (WsError.JWT_NOT_ACTIVE.code as WsErrorCode)
            : /invalid|malformed|signature/i.test(msg)
              ? (WsError.JWT_INVALID.code as WsErrorCode)
              : undefined);
      const mapped = this.mapAuthReasonToWsError(inferred);

      this.logger.error(
        `[WS][CONNECT_ERROR] code=${mapped.code} msg="${mapped.message}" ns=${socket.nsp?.name ?? '/'} sid=${socket.id} ip=${socket.handshake?.address || ''}`,
        (err as Error)?.stack,
        SocketIoGateway.name,
      );

      try {
        const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
        this.server.to('role:admin').emit(CHANNELS.CONNECT_ERROR, {
          code: mapped.code,
          message: mapped.message,
          ns: ctx.ns,
          sid: ctx.sid,
          ip: ctx.ip,
        });
      } catch {}
      try {
        // Send a structured "connect:error" event to the failing client too
        socket.emit(CHANNELS.CONNECT_ERROR, {
          code: mapped.code,
          message: mapped.message,
        });
      } catch (e2) {
        this.logger.debug(
          `socket.emit(connect:error) failed: ${(e2 as Error)?.message}`,
          SocketIoGateway.name,
        );
      }

      if (inferred === WsError.JWT_EXPIRED.code) {
        await this.disconnectWithNotice(socket, mapped.code, mapped.message);
        return;
      }

      await this.disconnectWithNotice(socket, mapped.code, mapped.message);
    }
  }

  handleDisconnect(socket: Socket) {
    const started =
      (socket as any)['__startTime'] || socket.data?.connectedAt || Date.now();
    const dur = Date.now() - started;
    const role =
      getEnumText(
        RoleEnum,
        socket.data?.user?.role?.id ?? socket.data?.user?.role,
      ) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatDisconnectLogContext(
      SocketIoGateway.name,
      socket.nsp?.name ?? '/',
      socket.id,
      socket.handshake?.address || '',
      String(socket.data?.user?.id ?? 'unknown'),
      role,
      undefined,
      dur,
    );
    this.logger.warn(line, SocketIoGateway.name);
    try {
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const uid = socket.data?.user?.id
        ? String(socket.data.user.id)
        : undefined;
      // Tell admins about all disconnects
      this.server.to('role:admin').emit(CHANNELS.DISCONNECT_INCOMING, {
        ns: ctx.ns,
        sid: ctx.sid,
        ip: ctx.ip,
        userId: uid || 'unknown',
      });
      // Tell this user room (use non-reserved event name)
      if (uid) {
        this.server
          .to(`user:${uid}`)
          .emit(CHANNELS.DISCONNECT_DONE, { sid: ctx.sid });
      }
    } catch (err) {
      this.logger.debug(
        `broadcast disconnect logs failed: ${(err as Error)?.message}`,
        SocketIoGateway.name,
      );
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() socket: Socket) {
    const t0 = Date.now();
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const role =
      getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      SocketIoGateway.name,
      ctx.ns,
      ctx.sid,
      ctx.ip,
      ctx.userId,
      role,
      'ping',
      0,
      Date.now() - t0,
    );
    this.logger.debug(line, SocketIoGateway.name);
    socket.emit(WsEvent.PONG.value);
  }

  @UseGuards(SocketIoRoleGuard)
  @SubscribeMessage('rpc')
  handleRpc(@MessageBody() message: string, @ConnectedSocket() socket: Socket) {
    try {
      const t0 = Date.now();
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const size = LoggerSocketIoPlugin.sizeOf(message);
      const role =
        getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
      const line = LoggerSocketIoPlugin.formatEventLogContext(
        SocketIoGateway.name,
        ctx.ns,
        ctx.sid,
        ctx.ip,
        ctx.userId,
        role,
        'rpc',
        size,
        Date.now() - t0,
      );
      this.logger.log(line, SocketIoGateway.name);
      this.server.emit(WsEvent.MSG_TO_CLIENT.value, {
        user: ctx.userEmail ?? 'unknown',
        message,
      });
    } catch (e) {
      const reason = (socket.data as any)?.wsAuthError?.reason as
        | string
        | undefined;
      const msg = (e as Error)?.message || '';
      const inferred: WsErrorCode | undefined =
        (reason as WsErrorCode | undefined) ||
        (/jwt\s*expired|TokenExpiredError/i.test(msg)
          ? (WsError.JWT_EXPIRED.code as WsErrorCode)
          : /not\s*active|not\s*before/i.test(msg)
            ? (WsError.JWT_NOT_ACTIVE.code as WsErrorCode)
            : /invalid|malformed|signature/i.test(msg)
              ? (WsError.JWT_INVALID.code as WsErrorCode)
              : undefined);
      const mapped = this.mapAuthReasonToWsError(inferred);

      if (inferred === WsError.JWT_EXPIRED.code) {
        this.markTokenExpired(socket);
        return;
      }

      this.emitWsError(socket, mapped.code, mapped.message);
    }
  }

  @SubscribeMessage('whoami')
  whoami(@ConnectedSocket() socket: Socket) {
    const t0 = Date.now();
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const role =
      getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      SocketIoGateway.name,
      ctx.ns,
      ctx.sid,
      ctx.ip,
      ctx.userId,
      role,
      'whoami',
      0,
      Date.now() - t0,
    );
    this.logger.debug(line, SocketIoGateway.name);
    const u = socket.data?.user ?? null;
    if (u) {
      this.logger.debug(
        `[WS][WHOAMI] ns=${ctx.ns} sid=${ctx.sid} userId=${u.id}`,
        SocketIoGateway.name,
      );
    }
    return {
      ok: true,
      user: u
        ? {
            id: u.id,
            email: u.email,
            role:
              getEnumText(RoleEnum, u?.role?.id ?? u?.role) ||
              getEnumText(RoleEnum, RoleEnum.user),
          }
        : null,
    };
  }

  // Optional: token rotation without reconnecting
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @SubscribeMessage('re-auth')
  async reAuth(
    @MessageBody() body: SocketIoReAuthDto,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      // Enforce grace window and attempts *only if* window is present
      const until = socket.data?.reauthUntil as number | undefined;
      if (typeof until === 'number') {
        if (Date.now() > until) {
          await this.disconnectWithNotice(
            socket,
            WsError.REAUTH_WINDOW_CLOSED.code,
            WsError.REAUTH_WINDOW_CLOSED.message,
          );
          return { ok: false };
        }
        const tries = (socket.data.reauthTries || 0) + 1;
        socket.data.reauthTries = tries;
        if (tries > this.maxReauthTries) {
          await this.disconnectWithNotice(
            socket,
            WsError.REAUTH_TOO_MANY_ATTEMPTS.code,
            WsError.REAUTH_TOO_MANY_ATTEMPTS.message,
          );
          return { ok: false };
        }
      }
      const user = await this.auth.reAuthenticate(socket, body.token);
      const t0 = Date.now();
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const role =
        getEnumText(RoleEnum, user?.role?.id ?? user?.role) ||
        getEnumText(RoleEnum, RoleEnum.user);
      const okLine = LoggerSocketIoPlugin.formatEventLogContext(
        SocketIoGateway.name,
        ctx.ns,
        ctx.sid,
        ctx.ip,
        String(user.id),
        role,
        're-auth.ok',
        0,
        Date.now() - t0,
      );
      this.logger.log(okLine, SocketIoGateway.name);
      // Clear grace window on success
      if (socket.data) {
        delete socket.data.reauthUntil;
        delete socket.data.reauthTries;
      }
      return {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          role:
            getEnumText(RoleEnum, user?.role?.id ?? user?.role) ||
            getEnumText(RoleEnum, RoleEnum.user),
        },
      };
    } catch (e) {
      const reason = (socket.data as any)?.wsAuthError?.reason as
        | string
        | undefined;
      const msg = (e as Error)?.message || '';
      const inferred: WsErrorCode | undefined =
        (reason as WsErrorCode | undefined) ||
        (/jwt\s*expired|TokenExpiredError/i.test(msg)
          ? (WsError.JWT_EXPIRED.code as WsErrorCode)
          : /not\s*active|not\s*before/i.test(msg)
            ? (WsError.JWT_NOT_ACTIVE.code as WsErrorCode)
            : /invalid|malformed|signature/i.test(msg)
              ? (WsError.JWT_INVALID.code as WsErrorCode)
              : undefined);
      if (inferred === WsError.JWT_EXPIRED.code) {
        this.markTokenExpired(socket);
      } else {
        const mapped = this.mapAuthReasonToWsError(inferred);
        this.emitWsError(socket, mapped.code, mapped.message);
      }

      const t0 = Date.now();
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const role =
        getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
      const failLine = LoggerSocketIoPlugin.formatEventLogContext(
        SocketIoGateway.name,
        ctx.ns,
        ctx.sid,
        ctx.ip,
        ctx.userId,
        role,
        're-auth.fail',
        0,
        Date.now() - t0,
      );
      this.logger.warn(failLine, SocketIoGateway.name);
      return {
        ok: false,
        error: {
          code: WsError.REAUTH_FAILED.code,
          message: WsError.REAUTH_FAILED.message,
        },
      };
    }
  }
}
