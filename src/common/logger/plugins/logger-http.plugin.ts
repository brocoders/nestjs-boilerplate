import chalk from 'chalk';
import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtPayloadType } from '../../../auth/strategies/types/jwt-payload.type';

export class LoggerPlugin {
  static extractHttpContext(context: ExecutionContext | ArgumentsHost) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request & { user?: JwtPayloadType }>();
    const response = ctx.getResponse<Response>();

    const method = request.method;
    const url = request.url;
    const ip = request.ip || request.connection?.remoteAddress || '';
    const statusCode = response?.statusCode;
    const user = request.user;
    const userId = user?.id ?? 'anonymous';
    const role = user?.role ?? 'guest';
    const message = (response as any)?.__message ?? '';
    const startTime = request['__startTime'] || Date.now();

    return {
      method,
      url,
      ip,
      statusCode,
      userId,
      role,
      message,
      startTime,
    };
  }

  static formatHttpLogContext(
    source: string,
    method: string,
    statusCode: number,
    url: string,
    ip: string,
    userId: string,
    role: string,
    message: string,
    duration: number,
  ): string {
    const coloredMethod = chalk.cyanBright(method.toUpperCase());
    const coloredStatus =
      statusCode >= 500
        ? chalk.redBright(statusCode.toString())
        : statusCode >= 400
          ? chalk.yellowBright(statusCode.toString())
          : chalk.greenBright(statusCode.toString());
    const responseTime = chalk.gray(`+${duration}ms`);

    return `[${source}] [${coloredMethod}::${url}][${coloredStatus}] [${ip}] [User::${userId},${role}]: ${message} ${responseTime}`;
  }
}
