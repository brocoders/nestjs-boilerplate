import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [TwitterService, ConfigModule, ConfigService],
})
export class TwitterModule {}
