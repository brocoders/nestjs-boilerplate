

import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';

@Global()
@Module({
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}