import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { Namespace, Server } from 'socket.io';
import { isSocketIoRedisBootstrapped } from './adapters/socketio-redis.boostrap';
import { TypeMessage } from '../../utils/types/message.type';
import { GroupPlainToInstance } from '../../utils/transformers/class.transformer';
import { RoleEnum } from '../../roles/roles.enum';
import {
  EmitBroadcastDto,
  EmitRoomDto,
  EmitUserDto,
} from './dto/emit-socketio.dto';
import {
  HealthDto,
  NamespacesDto,
  RoomsDto,
  SocketsDto,
  SocketInfoDto,
  EmitNamespaceResultDto,
  EmitRoomResultDto,
  EmitUserResultDto,
} from './dto/response-socketio.dto';
import { SocketServerProvider } from './utils/socketio.provider';
import { QueryNamespaceDto } from './dto/query-socketio.dto';
import { UserPresenceDto, PresenceSocketDto } from './dto/user-socketio.dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/domain/user';

@Injectable()
export class SocketIoService {
  constructor(
    private readonly serverRef: SocketServerProvider,
    private readonly usersService: UsersService,
  ) {}

  /** Ensure namespace has a leading slash and fallback to /ws */
  private normalizeNs(namespace?: string): string {
    const raw = (namespace ?? '').trim();
    if (!raw) return '/ws';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  /** Resolve a namespace (defaults to `/ws`) */
  private nsp(namespace?: string): Namespace {
    const ns = this.normalizeNs(namespace);
    const ref: any = this.serverRef.server as any;

    // If we got a Server, resolve namespace via .of()
    if (ref && typeof ref.of === 'function') {
      return ref.of(ns);
    }

    // If we got a Namespace already (namespaced gateway case), just return it when names match
    if (ref && typeof ref.to === 'function' && typeof ref.name === 'string') {
      // If it is the default namespace of this service, use it
      if (ref.name === ns) return ref as Namespace;
      // Otherwise, try to traverse back to the root Server
      if (ref.server && typeof ref.server.of === 'function') {
        return ref.server.of(ns);
      }
    }

    throw new UnprocessableEntityException({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: TypeMessage.getMessageByStatus(HttpStatus.SERVICE_UNAVAILABLE),
      errors: { namespace: 'SocketIoServerUnavailable' },
    });
  }

  /** Basic health/status + list of namespaces */
  health(): HealthDto {
    const io: Server = this.serverRef.server;
    const namespaces = Array.from(
      (io as any)._nsps?.keys?.() ?? io.of('/').server?._nsps?.keys?.() ?? [],
    );

    return GroupPlainToInstance(
      HealthDto,
      {
        ok: true,
        bootstrapped: isSocketIoRedisBootstrapped(),
        namespaces,
      },
      [RoleEnum.admin],
    );
  }

  /** List namespaces */
  namespaces(): NamespacesDto {
    const io: Server = this.serverRef.server;
    const namespaces = Array.from(
      (io as any)._nsps?.keys?.() ?? io.of('/').server?._nsps?.keys?.() ?? [],
    );

    return GroupPlainToInstance(NamespacesDto, { namespaces }, [
      RoleEnum.admin,
    ]);
  }

  /** List rooms in a namespace */
  rooms(query: QueryNamespaceDto): RoomsDto {
    const namespace = this.normalizeNs(query?.namespace);
    const nsp = this.nsp(namespace);
    const rooms = Array.from(nsp.adapter.rooms?.keys?.() ?? []);

    return GroupPlainToInstance(RoomsDto, { namespace: namespace, rooms }, [
      RoleEnum.admin,
    ]);
  }

  /** List sockets in a namespace */
  async sockets(query: QueryNamespaceDto): Promise<SocketsDto> {
    const namespace = this.normalizeNs(query?.namespace);
    const nsp = this.nsp(namespace);
    const sockets = await nsp.fetchSockets();

    const list = sockets.map((s) => ({
      id: s.id,
      rooms: Array.from(s.rooms || []),
      user: s.data?.user
        ? {
            id: s.data.user.id,
            email: s.data.user.email ?? null,
            role: s.data.user?.role ?? null,
          }
        : null,
      ip: s.handshake?.address ?? null,
    }));

    return GroupPlainToInstance(
      SocketsDto,
      {
        namespace: namespace,
        sockets: list.map((x) =>
          GroupPlainToInstance(SocketInfoDto, x, [RoleEnum.admin]),
        ),
      },
      [RoleEnum.admin],
    );
  }

  /** Broadcast event to a namespace */
  broadcast(dto: EmitBroadcastDto): EmitNamespaceResultDto {
    const namespace = this.normalizeNs(dto.namespace);

    if (!dto.event?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { event: 'EventRequired' },
      });
    }

    this.nsp(namespace).emit(dto.event, dto.data);
    return GroupPlainToInstance(
      EmitNamespaceResultDto,
      { ok: true, namespace, event: dto.event },
      [RoleEnum.admin],
    );
  }

  /** Emit to a room */
  emitToRoom(dto: EmitRoomDto): EmitRoomResultDto {
    const namespace = this.normalizeNs(dto.namespace);

    if (!dto.room?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { room: 'RoomRequired' },
      });
    }

    if (!dto.event?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { event: 'EventRequired' },
      });
    }

    this.nsp(namespace).to(dto.room).emit(dto.event, dto.data);
    return GroupPlainToInstance(
      EmitRoomResultDto,
      { ok: true, namespace, room: dto.room, event: dto.event },
      [RoleEnum.admin],
    );
  }

  /** Emit to a user's personal room (user:{id}) */
  emitToUser(dto: EmitUserDto): EmitUserResultDto {
    if (!dto.userId?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { userId: 'UserIdRequired' },
      });
    }

    if (!dto.event?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { event: 'EventRequired' },
      });
    }

    const namespace = this.normalizeNs((dto as any).namespace);
    this.nsp(namespace).to(`user:${dto.userId}`).emit(dto.event, dto.data);
    return GroupPlainToInstance(
      EmitUserResultDto,
      { ok: true, namespace, userRoom: `user:${dto.userId}`, event: dto.event },
      [RoleEnum.admin],
    );
  }

  /** Disconnect a socket by ID */
  async disconnectSocket(id: string, query: QueryNamespaceDto): Promise<void> {
    if (!id?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { id: 'SocketIdRequired' },
      });
    }

    const namespace = this.normalizeNs(query?.namespace);
    const nsp = this.nsp(namespace);
    const sockets = await nsp.fetchSockets();
    const target = sockets.find((s) => s.id === id);
    if (target) await target.disconnect(true);
  }

  /** Kick a user: disconnect all sockets in user:{id} */
  async kickUser(userId: string, query: QueryNamespaceDto): Promise<void> {
    if (!userId?.trim()) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { userId: 'UserIdRequired' },
      });
    }

    const namespace = this.normalizeNs(query?.namespace);
    const nsp = this.nsp(namespace);
    const sockets = await nsp.fetchSockets();
    await Promise.all(
      sockets
        .filter((s) => s.rooms?.has?.(`user:${userId}`))
        .map((s) => s.disconnect(true)),
    );
  }
  /** Check if a user is connected and return presence details */
  /** Check if a user is connected and return presence details */
  async userPresence(
    userId: string,
    query: QueryNamespaceDto,
  ): Promise<UserPresenceDto> {
    try {
      if (!userId?.trim()) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          errors: { userId: 'UserIdRequired' },
        });
      }

      // 🔹 Check user existence in DB
      const userInDb: User | null = await this.usersService.findById(userId);
      if (!userInDb) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          errors: { user: 'UserNotExist' },
        });
      }

      const namespace = this.normalizeNs(query?.namespace);
      const nsp = this.nsp(namespace);
      const userRoom = `user:${userId}`;

      // Prefer room-targeted fetch (more efficient). If empty, fall back to scanning all sockets
      let owned = await nsp.in(userRoom).fetchSockets();
      if (!owned.length) {
        const all = await nsp.fetchSockets();
        owned = all.filter((s) => s.data?.user?.id === userId);
      }
      if (!owned.length) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          message: TypeMessage.getMessageByStatus(
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
          errors: { user: 'UserNotConnected' },
        });
      }

      const socketDtos = owned.map((s) =>
        GroupPlainToInstance(
          PresenceSocketDto,
          {
            id: s.id,
            rooms: Array.from(s.rooms || []),
            ip: s.handshake?.address ?? null,
            connected: true,
          },
          [RoleEnum.admin],
        ),
      );

      return GroupPlainToInstance(
        UserPresenceDto,
        {
          namespace,
          userRoom,
          connected: socketDtos.length > 0,
          socketCount: socketDtos.length,
          sockets: socketDtos,
          user: {
            id: userInDb.id,
            email: userInDb.email ?? null,
          },
        },
        [RoleEnum.admin],
      );
    } catch (e) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        message: TypeMessage.getMessageByStatus(
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        errors: { presence: (e as Error)?.message || 'PresenceCheckFailed' },
      });
    }
  }
}
