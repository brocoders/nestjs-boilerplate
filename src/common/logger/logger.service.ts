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
      LogLevel.LOG,
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
      LogLevel.ERROR,
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
      LogLevel.WARN,
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
      LogLevel.DEBUG,
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
      LogLevel.TRACE,
    );
    console.trace(formatted);
  }

  private format(
    type: LoggerType,
    message: any,
    context?: string,
    trace?: string,
    loadTime?: number,
    level?: LogLevel, // <- added
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
    const logLevel =
      level ?? (type === LoggerType.SYSTEM ? LogLevel.LOG : LogLevel.DEBUG);
    const header = formatNestHeader(timestamp, logLevel, ctx, type);

    return `${header} ${msg}${traceStr}${durationStr}`;
  }
}
