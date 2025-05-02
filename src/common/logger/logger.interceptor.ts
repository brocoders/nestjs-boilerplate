import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from './logger.service';
import { Request, Response } from 'express';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl, ip } = request;

    const userAgent = request.get('user-agent') || '';
    const start = Date.now();

    return next.handle().pipe(
      tap((data) => {
        const duration = Date.now() - start;

        this.logger.log(
          {
            method,
            url: originalUrl,
            statusCode: response.statusCode,
            duration: `${duration}ms`,
            userAgent,
            ip,
            response: data,
          },
          'HTTP',
        );
      }),
    );
  }
}
