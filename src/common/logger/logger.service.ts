import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { format } from 'date-fns';
import { LoggerType, LogLevel } from './types/logger-enum.type';
import { stringifyJson, formatNestHeader } from './utils/logger.helper';
import chalk from 'chalk';

@Injectable()
export class LoggerService implements NestLoggerService {
  private lastLogTime = Date.now();

  log(message: any, context?: string, loadTime?: number) {
    console.log(
      this.format(
        LoggerType.SYSTEM,
        message,
        context,
        undefined,
        loadTime,
        LogLevel.LOG,
      ),
    );
  }

  error(message: any, trace?: string, context?: string, loadTime?: number) {
    console.error(
      this.format(
        LoggerType.SYSTEM,
        message,
        context,
        trace,
        loadTime,
        LogLevel.ERROR,
      ),
    );
  }

  warn(message: any, context?: string, loadTime?: number) {
    console.warn(
      this.format(
        LoggerType.SYSTEM,
        message,
        context,
        undefined,
        loadTime,
        LogLevel.WARN,
      ),
    );
  }

  debug(message: any, context?: string, loadTime?: number) {
    console.debug(
      this.format(
        LoggerType.DEV,
        message,
        context,
        undefined,
        loadTime,
        LogLevel.DEBUG,
      ),
    );
  }

  verbose(message: any, context?: string, loadTime?: number) {
    console.trace(
      this.format(
        LoggerType.DEV,
        message,
        context,
        undefined,
        loadTime,
        LogLevel.TRACE,
      ),
    );
  }

  private format(
    type: LoggerType,
    message: any,
    context?: string,
    trace?: string,
    loadTime?: number,
    level?: LogLevel,
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

    const rawLevel = (level ?? LogLevel.LOG).toUpperCase();
    let coloredLevel: string;
    switch (rawLevel) {
      case LogLevel.ERROR.toUpperCase():
        coloredLevel = chalk.redBright(rawLevel);
        break;
      case LogLevel.WARN.toUpperCase():
        coloredLevel = chalk.yellowBright(rawLevel);
        break;
      case LogLevel.DEBUG.toUpperCase():
        coloredLevel = chalk.cyanBright(rawLevel);
        break;
      case LogLevel.TRACE.toUpperCase():
        coloredLevel = chalk.magentaBright(rawLevel);
        break;
      case LogLevel.FATAL.toUpperCase():
        coloredLevel = chalk.bgRed.whiteBright(rawLevel);
        break;
      default:
        coloredLevel = chalk.greenBright(rawLevel);
        break;
    }

    const header = formatNestHeader(timestamp, coloredLevel, ctx, type);

    return `${header} ${msg}${traceStr}${durationStr}`;
  }
}
