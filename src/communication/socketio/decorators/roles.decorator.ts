import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const SOCKET_ROLES_KEY = 'ws_roles';

/**
 * Attach roles metadata to WebSocket handlers.
 * Example usage: @WsRoles('Admin', 'User')
 */
export const WsRoles = (
  ...roles: (string | number)[]
): CustomDecorator<string> => SetMetadata(SOCKET_ROLES_KEY, roles.map(String));
