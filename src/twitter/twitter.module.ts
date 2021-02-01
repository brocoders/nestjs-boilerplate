import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TwitterService],
  exports: [TwitterService],
})
export class TwitterModule {}
