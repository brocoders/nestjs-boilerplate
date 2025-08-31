import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../../roles/roles.enum';

export const SOCKET_ROLES_KEY = 'ws_roles';

/**
 * Attach roles metadata to WebSocket handlers.
 * Example usage: @WsRoles('Admin', 'User', RoleEnum.Admin)
 * Roles can be strings, numbers, or RoleEnum values.
 */
export const WsRoles = (
  ...roles: (string | number | RoleEnum)[]
): CustomDecorator<string> =>
  SetMetadata(
    SOCKET_ROLES_KEY,
    roles.map((role) => String(role)),
  );
