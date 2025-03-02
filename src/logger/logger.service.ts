import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import chalk from 'chalk';
import { stringifyJson } from './logger.helper';

export class WinstonLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private context?: string) {
    this.logger = winston.createLogger({
      level: 'debug', // Capture all log levels
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          const logTag = this.mapNestLogLevel(level);
          const contextTag = this.context
            ? chalk.cyan(`[${this.context}]`)
            : '';

          // Convert objects to JSON
          if (typeof message === 'object') {
            message = stringifyJson(message);
          }

          return `${chalk.gray(`[${timestamp}]`)} ${logTag} ${contextTag}: ${message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  private mapNestLogLevel(level: string): string {
    const levelMap: Record<string, string> = {
      info: chalk.green('LOG'),
      error: chalk.red('ERROR'),
      warn: chalk.yellow('WARN'),
      debug: chalk.blue('DEBUG'),
      verbose: chalk.magenta('VERBOSE'),
    };
    return levelMap[level] || chalk.white(level.toUpperCase());
  }

  log(message: any) {
    this.logger.info(message);
  }

  error(message: any, trace?: string) {
    this.logger.error(`${message} ${trace ? `\nTrace: ${trace}` : ''}`);
  }

  warn(message: any) {
    this.logger.warn(message);
  }

  debug(message: any) {
    this.logger.debug(message);
  }

  verbose(message: any) {
    this.logger.verbose(message);
  }
}
