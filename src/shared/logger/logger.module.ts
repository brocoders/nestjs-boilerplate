import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { logger } from './logger';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        logger,
        autoLogging: true,
      },
      exclude: [{ method: RequestMethod.ALL, path: 'health' }],
    }),
  ],
})
export class LoggerModule { }
