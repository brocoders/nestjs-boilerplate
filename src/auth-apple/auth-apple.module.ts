import { Module } from '@nestjs/common';
import { AuthAppleService } from './auth-apple.service';
import { ConfigModule } from '@nestjs/config';
import { AuthAppleController } from './auth-apple.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthAppleService],
  exports: [AuthAppleService],
  controllers: [AuthAppleController],
})
export class AuthAppleModule {}
