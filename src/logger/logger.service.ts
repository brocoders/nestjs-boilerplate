import pino from 'pino';

import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from '../config/config.type';

@Injectable()
export class PinoLoggerService implements LoggerService {
  private logger: pino.Logger;

  constructor(private configService: ConfigService<AllConfigType>) {
    const loggerConfig = this.configService.get('logger', { infer: true });
    if (!loggerConfig) {
      throw new Error('Logger configuration is not defined');
    }

    this.logger = pino({
      level: loggerConfig.level || 'info',
      transport: loggerConfig.pretty
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
            },
          }
        : undefined,
    });
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.logger.trace(message, ...optionalParams);
  }
}
