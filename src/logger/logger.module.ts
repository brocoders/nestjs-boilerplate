import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import loggerConfig from '../config/logger.config';
import { LoggingInterceptor } from './logger.interceptor';
import { PinoLoggerService } from './logger.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(loggerConfig)],
  providers: [PinoLoggerService, LoggingInterceptor],
  exports: [PinoLoggerService, LoggingInterceptor],
})
export class LoggerModule {}
