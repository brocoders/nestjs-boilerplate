import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [FacebookService, ConfigModule, ConfigService],
})
export class FacebookModule {}
