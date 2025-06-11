import { Module } from '@nestjs/common';
import { AuthVeroService } from './auth-vero.service';
import { ConfigModule } from '@nestjs/config';
import { AuthVeroController } from './auth-vero.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { VeroPayloadMapper } from './infrastructure/persistence/relational/mappers/vero.mapper';

@Module({
  imports: [ConfigModule, AuthModule, JwtModule],
  providers: [AuthVeroService, VeroPayloadMapper], // Added VeroMapper here
  exports: [AuthVeroService],
  controllers: [AuthVeroController],
})
export class AuthVeroModule {}
