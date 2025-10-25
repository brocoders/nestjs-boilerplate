// logger.module.ts
import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';
import { LoggerExceptionFilter } from './logger-exception.filter';

@Global()
@Module({
  providers: [
    LoggerService,

    // Global HTTP interceptor (your existing one)
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },

    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: LoggerExceptionFilter,
    },
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
