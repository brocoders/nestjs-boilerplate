import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { SOCKET_ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class SocketIoRoleGuard implements CanActivate {
  private readonly logger = new Logger(SocketIoRoleGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(SOCKET_ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      this.logger.debug('No roles required. Access granted.');
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    const user = client?.data?.user;

    // Normalize current user role to a string for comparisons
    const rawRole = user?.role;
    const currentRole =
      typeof rawRole === 'string'
        ? rawRole
        : typeof rawRole === 'number'
          ? String(rawRole)
          : (rawRole?.name ?? (rawRole?.id ? String(rawRole.id) : undefined));

    this.logger.debug(`Required roles: ${requiredRoles.join(', ')}`);
    this.logger.debug(`Current user role: ${currentRole ?? 'none'}`);

    const allowed =
      !!currentRole && requiredRoles.map(String).includes(currentRole);

    if (!allowed) {
      const reason = `Access denied. Required: ${requiredRoles.join(
        ', ',
      )}, got: ${currentRole ?? 'none'}`;
      this.logger.warn(reason);
      throw new WsException({
        status: 'forbidden',
        message: reason,
      });
    }

    return true;
  }
}
