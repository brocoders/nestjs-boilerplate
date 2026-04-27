import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import IORedis from 'ioredis';
import { RedisService } from './redis.service';
import { AllConfigType } from '../config/config.type';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<AllConfigType>) => ({
        connection: {
          host: config.getOrThrow('redis.host', { infer: true }),
          port: config.getOrThrow('redis.port', { infer: true }),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService<AllConfigType>) =>
        new IORedis({
          host: config.getOrThrow('redis.host', { infer: true }),
          port: config.getOrThrow('redis.port', { infer: true }),
          maxRetriesPerRequest: null,
        }),
    },
    RedisService,
  ],
  exports: [BullModule, RedisService, 'REDIS_CLIENT'],
})
export class RedisModule {}
