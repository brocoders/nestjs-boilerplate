import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return roles.map(String).includes(String(request.user?.role?.id));
  }
}
