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

@WebSocketGateway({
  namespace: '/ws',
  cors: { origin: true, credentials: true },
  transports: ['websocket'],
  pingInterval: 20000,
  pingTimeout: 25000,
  maxHttpBufferSize: 1_000_000,
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly auth: SocketIoAuthService,
    private readonly serverRef: SocketServerProvider,
    private readonly logger: LoggerService,
  ) {}

  /** Compute approximate JSON payload size in bytes */
  private sizeOf(payload: unknown): number {
    try {
      return Buffer.byteLength(JSON.stringify(payload || {}));
    } catch {
      return 0;
    }
  }

  afterInit() {
    this.serverRef.setServer(this.server);
    const ctx = LoggerSocketIoPlugin.extractInitContext(this.server);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      'SocketIO',
      ctx.ns,
      '-',
      '-',
      '-',
      '-',
      'gateway.init',
      0,
      0,
    );
    this.logger.log(line, 'SocketIO');
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
        const role =
          getEnumText(RoleEnum, user?.role?.id ?? user?.role) ||
          getEnumText(RoleEnum, RoleEnum.user);
        const authOk = LoggerSocketIoPlugin.formatAuthLogContext(
          'SocketIO',
          socket.nsp?.name ?? '/',
          socket.id,
          socket.handshake?.address || '',
          String(user.id),
          role,
          true,
        );
        this.logger.log(authOk, 'SocketIO');
      } else {
        const authFail = LoggerSocketIoPlugin.formatAuthLogContext(
          'SocketIO',
          socket.nsp?.name ?? '/',
          socket.id,
          socket.handshake?.address || '',
          'anonymous',
          'guest',
          false,
          'no token',
        );
        this.logger.warn(authFail, 'SocketIO');
        socket.emit('auth.error', {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        });
        socket.disconnect(true);
        return;
      }

      const role =
        getEnumText(
          RoleEnum,
          socket.data?.user?.role?.id ?? socket.data?.user?.role,
        ) || getEnumText(RoleEnum, RoleEnum.user);
      const connLine = LoggerSocketIoPlugin.formatConnectLogContext(
        'SocketIO',
        socket.nsp?.name ?? '/',
        socket.id,
        socket.handshake?.address || '',
        String(socket.data?.user?.id ?? 'unknown'),
        role,
        Date.now() - (socket as any)['__startTime'],
      );
      this.logger.log(connLine, 'SocketIO');
    } catch (err) {
      const role =
        getEnumText(
          RoleEnum,
          socket.data?.user?.role?.id ?? socket.data?.user?.role,
        ) || getEnumText(RoleEnum, RoleEnum.user);
      const failLine = LoggerSocketIoPlugin.formatAuthLogContext(
        'SocketIO',
        socket.nsp?.name ?? '/',
        socket.id,
        socket.handshake?.address || '',
        String(socket.data?.user?.id ?? 'unknown'),
        role,
        false,
        (err as Error)?.message,
      );
      this.logger.error(failLine, 'SocketIO');
      socket.emit('auth.error', {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token',
      });
      socket.disconnect(true);
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
      'SocketIO',
      socket.nsp?.name ?? '/',
      socket.id,
      socket.handshake?.address || '',
      String(socket.data?.user?.id ?? 'unknown'),
      role,
      undefined,
      dur,
    );
    this.logger.warn(line, 'SocketIO');
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() socket: Socket) {
    const t0 = Date.now();
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const role =
      getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      'SocketIO',
      ctx.ns,
      ctx.sid,
      ctx.ip,
      ctx.userId,
      role,
      'ping',
      0,
      Date.now() - t0,
    );
    this.logger.debug(line, 'SocketIO');
    socket.emit('pong');
  }

  @UseGuards(SocketIoRoleGuard)
  @SubscribeMessage('rpc')
  handleRpc(@MessageBody() message: string, @ConnectedSocket() socket: Socket) {
    const t0 = Date.now();
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const size = LoggerSocketIoPlugin.sizeOf(message);
    const role =
      getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      'SocketIO',
      ctx.ns,
      ctx.sid,
      ctx.ip,
      ctx.userId,
      role,
      'rpc',
      size,
      Date.now() - t0,
    );
    this.logger.log(line, 'SocketIO');
    this.server.emit('msgToClient', {
      user: ctx.userEmail ?? 'unknown',
      message,
    });
  }

  @SubscribeMessage('whoami')
  whoami(@ConnectedSocket() socket: Socket) {
    const t0 = Date.now();
    const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
    const role =
      getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
    const line = LoggerSocketIoPlugin.formatEventLogContext(
      'SocketIO',
      ctx.ns,
      ctx.sid,
      ctx.ip,
      ctx.userId,
      role,
      'whoami',
      0,
      Date.now() - t0,
    );
    this.logger.debug(line, 'SocketIO');
    const u = socket.data?.user ?? null;
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
      const user = await this.auth.reAuthenticate(socket, body.token);
      const t0 = Date.now();
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const role =
        getEnumText(RoleEnum, user?.role?.id ?? user?.role) ||
        getEnumText(RoleEnum, RoleEnum.user);
      const okLine = LoggerSocketIoPlugin.formatEventLogContext(
        'SocketIO',
        ctx.ns,
        ctx.sid,
        ctx.ip,
        String(user.id),
        role,
        're-auth.ok',
        0,
        Date.now() - t0,
      );
      this.logger.log(okLine, 'SocketIO');
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      const t0 = Date.now();
      const ctx = LoggerSocketIoPlugin.extractSocketContext(socket);
      const role =
        getEnumText(RoleEnum, ctx.role) || getEnumText(RoleEnum, RoleEnum.user);
      const failLine = LoggerSocketIoPlugin.formatEventLogContext(
        'SocketIO',
        ctx.ns,
        ctx.sid,
        ctx.ip,
        ctx.userId,
        role,
        're-auth.fail',
        0,
        Date.now() - t0,
      );
      this.logger.warn(failLine, 'SocketIO');
      return {
        ok: false,
        error: { code: 'REAUTH_FAILED', message: 'Invalid or expired token' },
      };
    }
  }
}
