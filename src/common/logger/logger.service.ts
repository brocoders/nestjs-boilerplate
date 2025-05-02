import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { format } from 'date-fns';
import { LoggerType } from './types/logger-enum.type';
import { stringifyJson, formatNestHeader } from './logger.helper';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: any, context?: string) {
    const formatted = this.format(LoggerType.SYSTEM, message, context);
    console.log(formatted);
  }

  error(message: any, trace?: string, context?: string) {
    const formatted = this.format(LoggerType.SYSTEM, message, context, trace);
    console.error(formatted);
  }

  warn(message: any, context?: string) {
    const formatted = this.format(LoggerType.SYSTEM, message, context);
    console.warn(formatted);
  }

  debug(message: any, context?: string) {
    const formatted = this.format(LoggerType.DEV, message, context);
    console.debug(formatted);
  }

  verbose(message: any, context?: string) {
    const formatted = this.format(LoggerType.DEV, message, context);
    console.trace(formatted);
  }

  private format(
    type: LoggerType,
    message: any,
    context?: string,
    trace?: string,
  ): string {
    const timestamp = format(new Date(), 'MM/dd/yyyy, h:mm:ss a');
    const ctx = context ?? '';
    const msg =
      typeof message === 'object'
        ? stringifyJson(message && Object.keys(message).length ? message : {})
        : String(message);
    const traceStr = trace ? `\n${trace}` : '';

    const logLevel = type === LoggerType.SYSTEM ? 'LOG' : 'DEBUG';
    const header = formatNestHeader(timestamp, logLevel, ctx, type);

    return `${header} ${msg}${traceStr}`;
  }
}
