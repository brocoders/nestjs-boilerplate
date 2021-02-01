import { Module } from '@nestjs/common';
import { AppleService } from './apple.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [AppleService],
  exports: [AppleService],
})
export class AppleModule {}
