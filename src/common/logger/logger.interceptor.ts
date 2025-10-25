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
import {
  getReadableClientIpSync,
  getClientAgentName,
} from 'src/utils/helpers/ip-agent.helper';

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

        const user = (request as any).user as any;
        const userId = user?.id ?? 'anonymous';
        const role = user?.role?.name ?? 'guest';

        const ip = getReadableClientIpSync(request);
        const agent = getClientAgentName(request);

        const duration = Date.now() - start;
        const statusCode = response.statusCode ?? 0;

        // We pass parameters in the desired order:
        const line = LoggerPlugin.formatHttpLogContext(
          `${className}::${handlerName}`, // source
          request.method ?? '', // method
          statusCode, // statusCode
          request.url ?? '', // url
          role, // role
          userId, // userId
          ip, // ip
          agent, // agent
          response?.statusMessage ?? '', // message
          duration, // duration
        );

        this.logger.log(line, LoggerType.HTTP);
      }),
    );
  }
}
