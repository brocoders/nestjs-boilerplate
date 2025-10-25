import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from './logger.service';
import { LoggerPlugin } from './plugins/logger-http.plugin';
import { LoggerType, LogLevel } from './types/logger-enum.type';
import { isAxiosError } from 'axios';
import { AllConfigType } from '../../config/config.type';
import {
  getClientAgentName,
  getReadableClientIpSync,
} from 'src/utils/helpers/ip-agent.helper';
import {
  getStatusFromException,
  getShortMessage,
  pickLevel,
} from './utils/logger.helper';
import { NodeEnv } from '../../utils/types/gobal.type';
import { getEnumText } from '../../utils/helpers/enum.helper';

/** Ensure context lands in the correct arg for each logger method.
 *  Supports both our LogLevel enum and string-union levels.
 */
function logByLevel(
  logger: LoggerService,
  level: LogLevel | 'error' | 'warn' | 'debug' | 'log' | 'trace' | 'fatal',
  message: string,
  context = 'HTTP',
  loadTime?: number,
) {
  const v = String(level).toLowerCase();
  switch (v) {
    case LogLevel.FATAL: // 'fatal'
    case LogLevel.ERROR: // 'error'
    case 'fatal':
    case 'error':
      // LoggerService.error(message, trace?, context?, loadTime?)
      logger.error(message, undefined, context, loadTime);
      break;

    case LogLevel.WARN: // 'warn'
    case 'warn':
      // LoggerService.warn(message, context?, loadTime?)
      logger.warn(message, context, loadTime);
      break;

    case LogLevel.LOG: // 'log'
    case 'log':
      // LoggerService.log(message, context?, loadTime?)
      logger.log(message, context, loadTime);
      break;

    case LogLevel.TRACE: // 'trace'
    case 'trace':
      // LoggerService.verbose(message, context?, loadTime?)
      logger.verbose(message, context, loadTime);
      break;

    case LogLevel.DEBUG: // 'debug'
    case 'debug':
    default:
      // LoggerService.debug(message, context?, loadTime?)
      logger.debug(message, context, loadTime);
      break;
  }
}

@Catch()
export class LoggerExceptionFilter implements ExceptionFilter {
  private readonly isProd: boolean;
  private readonly noStackStatuses = new Set<number>([
    HttpStatus.SERVICE_UNAVAILABLE, // 503 → don't print stack/upstream
  ]);

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {
    const nodeEnv =
      this.configService.get('app.nodeEnv', 'development', { infer: true }) ??
      'development';
    this.isProd = nodeEnv === getEnumText(NodeEnv, NodeEnv.PRODUCTION);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<
      Request & { user?: any; __startTime?: number }
    >();
    const response = ctx.getResponse<Response & { __message?: string }>();

    const startedAt = request.__startTime ?? Date.now();

    // ---- status & message ----
    const status = getStatusFromException(exception);
    const shortMsg = getShortMessage(exception);

    // ---- client info ----
    const ip = getReadableClientIpSync(request);
    const agentName = getClientAgentName(request);

    // ---- duration ----
    const duration = Date.now() - startedAt;

    // headers (always)
    response.__message = shortMsg;
    response.setHeader('X-Execution-Time', `${duration}ms`);
    response.setHeader('X-Client-Agent-Name', agentName);

    // ---- user & request context ----
    const method = request.method ?? '';
    const url = (request as any).originalUrl || request.url || '';
    const user = request.user ?? { id: 'anonymous', role: { name: 'guest' } };
    const userId = user?.id?.toString() ?? 'anonymous';
    const role = user?.role?.name ?? user?.role ?? 'guest';

    // ---- formatted log line (param order you set) ----
    const line = LoggerPlugin.formatHttpLogContext(
      'HTTP', // source
      method, // method
      status, // statusCode
      url, // url
      role, // role
      userId, // userId
      ip, // ip
      agentName, // agent
      shortMsg, // message
      duration, // duration
    );

    const level = pickLevel(status);
    logByLevel(this.logger, level, line, LoggerType.HTTP, duration);

    // ---- Dev: extra details only for 5xx EXCEPT 503 ----
    if (
      !this.isProd &&
      level === 'error' &&
      !this.noStackStatuses.has(status)
    ) {
      if (isAxiosError(exception) && exception.response?.data) {
        logByLevel(
          this.logger,
          level,
          `[Upstream] ${method} ${url} → ${status}\n${JSON.stringify(
            exception.response.data,
            null,
            2,
          )}`,
          LoggerType.HTTP,
        );
      }
      const stack = (exception as any)?.stack;
      if (typeof stack === 'string' && stack.trim()) {
        logByLevel(this.logger, level, `[Stack]\n${stack}`, LoggerType.HTTP);
      }
    }

    // ---- safe response body ----
    let body: any;
    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      body = typeof resp === 'string' ? { message: resp } : resp;
    } else if (isAxiosError(exception)) {
      body = this.isProd
        ? { message: shortMsg }
        : {
            message: shortMsg,
            upstream: {
              status: exception.response?.status,
              statusText: exception.response?.statusText,
              data: exception.response?.data,
            },
          };
    } else {
      body = this.isProd
        ? { message: 'Internal server error' }
        : { message: shortMsg };
    }

    if (!response.headersSent) {
      response.status(status).json(body);
    }
  }
}
