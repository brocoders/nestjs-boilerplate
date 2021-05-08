import { Module } from '@nestjs/common';
import { AuthTwitterService } from './auth-twitter.service';
import { ConfigModule } from '@nestjs/config';
import { AuthTwitterController } from './auth-twitter.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthTwitterService],
  exports: [AuthTwitterService],
  controllers: [AuthTwitterController],
})
export class AuthTwitterModule {}
