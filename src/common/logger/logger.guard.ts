import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LoggerContextGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const logger = new Logger('LoggerContextGuard');
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const ip = request.ip;
    const method = request.method;
    const url = request.url;
    const statusCode = context.switchToHttp().getResponse()?.statusCode;
    const role = user.role?.name;
    logger.debug(
      `Request - Method: ${method}, URL: ${url}, IP: ${ip}, StatusCode: ${statusCode}, UserID: ${user?.id}, Role: ${role}`,
    );

    return true;
  }
}
