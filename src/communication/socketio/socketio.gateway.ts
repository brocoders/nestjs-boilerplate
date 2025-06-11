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
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../auth/auth.service';
import { WsRoles } from './decorators/roles.decorator';
import { SocketIoRoleGuard } from './guards/socketio-role.guard';
//TODO: move message handlers  to another file
@WebSocketGateway({
  cors: {
    origin: '*', // or specify allowed origins
  },
})
export class SocketIoGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketIoGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.logger.log('SocketIo Gateway initialized');
  }

  afterInit(server: Server) {
    this.logger.log('Socket.IO server initialized');

    // Log server-level stats (if needed, here’s a simple example)
    const printClients = async () => {
      const sockets = await server.fetchSockets();
      this.logger.debug(`Total connected clients: ${sockets.length}`);
    };

    // Setup custom connection listener
    server.on('connection', (socket: Socket) => {
      this.logger.log(`New connection: ${socket.id}`);
      this.logger.debug(
        `Handshake headers: ${JSON.stringify(socket.handshake.headers, null, 2)}`,
      );
      this.logger.debug(`Auth token: ${socket.handshake.auth?.token}`);
      this.logger.debug(
        `Query params: ${JSON.stringify(socket.handshake.query)}`,
      );

      // Log on disconnect
      socket.on('disconnect', (reason: string) => {
        this.logger.warn(
          `Client disconnected: ${socket.id} (reason: ${reason})`,
        );
      });

      void printClients();
    });
  }

  async handleConnection(socket: Socket) {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.query?.token;

      if (!token) {
        this.logger.warn('Missing token');
        socket.disconnect(true);
        return;
      }

      const user = await this.authService.validateSocketToken(token);
      socket.data.user = user;

      this.logger.log(`Socket connected: ${socket.id} as user ${user.email}`);
    } catch (error) {
      this.logger.error('Socket authentication failed', error.message);
      socket.disconnect(true);
    }
  }

  handleDisconnect(socket: Socket): void {
    this.logger.log(`Socket disconnected: ${socket.data?.userId ?? socket.id}`);
  }

  @UseGuards(SocketIoRoleGuard)
  @WsRoles('Admin')
  @SubscribeMessage('rpc')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket,
  ): void {
    const user = socket.data.user;
    this.logger.log(`User ${user.email} said: ${message}`);

    this.server.emit('msgToClient', {
      user: user.email,
      message,
    });
  }
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    this.logger.log(`Received 'ping' from ${client.id}`);
    this.server.emit('pong');
  }
}
