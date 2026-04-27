import { Inject, Injectable } from '@nestjs/common';
import IORedis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: IORedis) {}

  raw(): IORedis {
    return this.client;
  }

  async ping(): Promise<'PONG'> {
    return (await this.client.ping()) as 'PONG';
  }
}
