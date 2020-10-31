import { Module } from '@nestjs/common';
import { AppleService } from './apple.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [AppleService, ConfigModule, ConfigService],
})
export class AppleModule {}
