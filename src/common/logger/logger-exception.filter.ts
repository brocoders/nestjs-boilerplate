// logger-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from './logger.service';
import { ExecutionContext } from '@nestjs/common';
import { LoggerPlugin } from './plugins/logger-http.plugin';
import { LoggerType } from './types/logger-enum.type';
@Catch()
export class LoggerExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host as ExecutionContext;
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const user = (request as any).user ?? {
      id: 'anonymous',
      role: { name: 'guest' },
    };

    const exceptionMessage =
      exception instanceof HttpException
        ? (exception.getResponse()?.['message'] ?? 'HTTP Exception')
        : 'Internal server error';

    const duration = Date.now() - ((request as any).__startTime || Date.now());

    const logMessage = LoggerPlugin.formatHttpLogContext(
      exceptionMessage,
      request.method ?? '',
      status ?? 0,
      request.url ?? '',
      request.ip ?? '',
      user?.id?.toString() ?? 'anonymous',
      user?.role?.name ?? 'guest',
      exceptionMessage,
      duration,
    );

    this.logger.debug(logMessage, LoggerType.HTTP);

    response
      .status(status)
      .json(
        exception instanceof HttpException
          ? exception.getResponse()
          : { message: 'Internal server error' },
      );
  }
}
