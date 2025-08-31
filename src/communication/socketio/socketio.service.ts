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
  SocketIoHealthDto,
  SocketIoNamespacesDto,
  SocketIoRoomsDto,
  SocketIoSocketsDto,
  SocketSummaryDto,
  OkDto,
} from './dto/socketio-dto';
import { SocketServerProvider } from './utils/socketio.provider';
import { QueryNamespaceDto } from './dto/query-socketio.dto';

@Injectable()
export class SocketIoService {
  constructor(private readonly serverRef: SocketServerProvider) {}

  /** Ensure namespace has a leading slash and fallback to /ws */
  private normalizeNs(namespace?: string): string {
    const raw = (namespace ?? '').trim();
    if (!raw) return '/ws';
    return raw.startsWith('/') ? raw : `/${raw}`;
  }

  /** Resolve a namespace (defaults to `/ws`) */
  private nsp(namespace?: string): Namespace {
    const io: Server = this.serverRef.server;
    return io.of(this.normalizeNs(namespace));
  }

  /** Basic health/status + list of namespaces */
  health(): SocketIoHealthDto {
    const io: Server = this.serverRef.server;
    const namespaces = Array.from(
      (io as any)._nsps?.keys?.() ?? io.of('/').server?._nsps?.keys?.() ?? [],
    );

    return GroupPlainToInstance(
      SocketIoHealthDto,
      {
        ok: true,
        bootstrapped: isSocketIoRedisBootstrapped(),
        namespaces,
      },
      [RoleEnum.admin],
    );
  }

  /** List namespaces */
  namespaces(): SocketIoNamespacesDto {
    const io: Server = this.serverRef.server;
    const namespaces = Array.from(
      (io as any)._nsps?.keys?.() ?? io.of('/').server?._nsps?.keys?.() ?? [],
    );

    return GroupPlainToInstance(SocketIoNamespacesDto, { namespaces }, [
      RoleEnum.admin,
    ]);
  }

  /** List rooms in a namespace */
  rooms(query: QueryNamespaceDto): SocketIoRoomsDto {
    const namespace = this.normalizeNs(query?.namespace);
    const nsp = this.nsp(namespace);
    const rooms = Array.from(nsp.adapter.rooms?.keys?.() ?? []);

    return GroupPlainToInstance(
      SocketIoRoomsDto,
      { namespace: namespace, rooms },
      [RoleEnum.admin],
    );
  }

  /** List sockets in a namespace */
  async sockets(query: QueryNamespaceDto): Promise<SocketIoSocketsDto> {
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
      SocketIoSocketsDto,
      {
        namespace: namespace,
        sockets: list.map((x) =>
          GroupPlainToInstance(SocketSummaryDto, x, [RoleEnum.admin]),
        ),
      },
      [RoleEnum.admin],
    );
  }

  /** Broadcast event to a namespace */
  broadcast(dto: EmitBroadcastDto): OkDto {
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
    return GroupPlainToInstance(OkDto, { ok: true }, [RoleEnum.admin]);
  }

  /** Emit to a room */
  emitToRoom(dto: EmitRoomDto): OkDto {
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
    return GroupPlainToInstance(OkDto, { ok: true }, [RoleEnum.admin]);
  }

  /** Emit to a user's personal room (user:{id}) */
  emitToUser(dto: EmitUserDto): OkDto {
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

    const io: Server = this.serverRef.server;
    io.to(`user:${dto.userId}`).emit(dto.event, dto.data);
    return GroupPlainToInstance(OkDto, { ok: true }, [RoleEnum.admin]);
  }

  /** Disconnect a socket by ID */
  async disconnectSocket(id: string, query: QueryNamespaceDto): Promise<OkDto> {
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

    return GroupPlainToInstance(OkDto, { ok: true }, [RoleEnum.admin]);
  }

  /** Kick a user: disconnect all sockets in user:{id} */
  async kickUser(userId: string, query: QueryNamespaceDto): Promise<OkDto> {
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

    return GroupPlainToInstance(OkDto, { ok: true }, [RoleEnum.admin]);
  }
}
