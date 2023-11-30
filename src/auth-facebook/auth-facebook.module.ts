import { Module } from '@nestjs/common';
import { AuthFacebookService } from './auth-facebook.service';
import { ConfigModule } from '@nestjs/config';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [AuthFacebookService],
  exports: [AuthFacebookService],
  controllers: [AuthFacebookController],
})
export class AuthFacebookModule {}
