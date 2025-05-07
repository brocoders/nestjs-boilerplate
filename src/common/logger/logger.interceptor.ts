import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';
import { LoggerPlugin } from './plugins/logger-http.plugin';
import { LoggerType } from './types/logger-enum.type';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ctx = context.switchToHttp();
        const handler = context.getHandler();
        const className = context.getClass().name;
        const handlerName = handler?.name ?? 'anonymous';
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const user = request.user as any;
        const userId = user?.id ?? 'anonymous';
        const role = user?.role?.name ?? 'guest';
        const log = LoggerPlugin.formatHttpLogContext(
          `${className}::${handlerName}`,
          request.method ?? '',
          response.statusCode ?? 0,
          request.url ?? '',
          request.ip ?? '',
          userId,
          role,
          response?.statusMessage ?? 'Unknown Message',
          Date.now() - start,
        );
        this.logger.debug(log, LoggerType.HTTP);
      }),
    );
  }
}
