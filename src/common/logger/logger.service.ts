import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { format } from 'date-fns';
import { LoggerType, LogLevel } from './types/logger-enum.type';
import { stringifyJson, formatNestHeader } from './logger.helper';

@Injectable()
export class LoggerService implements NestLoggerService {
  private lastLogTime = Date.now();

  log(message: any, context?: string, loadTime?: number) {
    const formatted = this.format(
      LoggerType.SYSTEM,
      message,
      context,
      undefined,
      loadTime,
    );
    console.log(formatted);
  }

  error(message: any, trace?: string, context?: string, loadTime?: number) {
    const formatted = this.format(
      LoggerType.SYSTEM,
      message,
      context,
      trace,
      loadTime,
    );
    console.error(formatted);
  }

  warn(message: any, context?: string, loadTime?: number) {
    const formatted = this.format(
      LoggerType.SYSTEM,
      message,
      context,
      undefined,
      loadTime,
    );
    console.warn(formatted);
  }

  debug(message: any, context?: string, loadTime?: number) {
    const formatted = this.format(
      LoggerType.DEV,
      message,
      context,
      undefined,
      loadTime,
    );
    console.debug(formatted);
  }

  verbose(message: any, context?: string, loadTime?: number) {
    const formatted = this.format(
      LoggerType.DEV,
      message,
      context,
      undefined,
      loadTime,
    );
    console.trace(formatted);
  }

  private format(
    type: LoggerType,
    message: any,
    context?: string,
    trace?: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadTime?: number,
  ): string {
    const timestamp = format(new Date(), 'MM/dd/yyyy, h:mm:ss a');
    const ctx = context ?? '';
    const msg =
      typeof message === 'object'
        ? stringifyJson(message && Object.keys(message).length ? message : {})
        : String(message);
    const traceStr = trace ? `\n${trace}` : '';
    const now = Date.now();
    const deltaTime = now - this.lastLogTime;
    this.lastLogTime = now;
    const durationStr = ` +${deltaTime}ms`;
    const logLevel = type === LoggerType.SYSTEM ? LogLevel.LOG : LogLevel.DEBUG;
    const header = formatNestHeader(timestamp, logLevel, ctx, type);

    return `${header} ${msg}${traceStr}${durationStr}`;
  }
}
