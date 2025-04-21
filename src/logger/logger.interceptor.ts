import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { PinoLoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query, params, headers } = request;
    const startTime = Date.now();

    // One-line info log for incoming request
    this.logger.log(`${method} ${url}`);

    // Detailed debug log
    this.logger.debug({
      message: 'Incoming Request',
      method,
      url,
      body,
      query,
      params,
      headers: this.sanitizeHeaders(headers),
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          // Log response
          this.logger.debug({
            message: 'Outgoing Response',
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            response: this.sanitizeResponse(data),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Log error
          this.logger.error({
            message: 'Request Error',
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            error: {
              message: error.message,
              stack: error.stack,
            },
          });
        },
      }),
    );
  }

  private sanitizeHeaders(headers: Record<string, any>): Record<string, any> {
    const sensitiveHeaders = ['authorization', 'cookie', 'set-cookie'];
    const sanitized = { ...headers };

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveHeaders.some((h) => h.toLowerCase() === key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      }
    });
    return sanitized;
  }

  private sanitizeResponse(data: any): any {
    if (!data) return data;

    const sensitiveFields = [
      'password',
      'token',
      'refreshToken',
      'accessToken',
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitizeResponse(item));
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };

      // Sanitize current level
      sensitiveFields.forEach((field) => {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]';
        }
      });

      // Recursively sanitize nested objects
      for (const key in sanitized) {
        if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
          sanitized[key] = this.sanitizeResponse(sanitized[key]);
        }
      }

      return sanitized;
    }
    return data;
  }
}
