import { Module } from '@nestjs/common';
import { FacebookService } from './facebook.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
