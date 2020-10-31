import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [GoogleService, ConfigModule, ConfigService],
})
export class GoogleModule {}
