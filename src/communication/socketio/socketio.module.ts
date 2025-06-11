import { Module } from '@nestjs/common';
import { SocketIoGateway } from './socketio.gateway';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
//TODO: Add enable mode for the module
@Module({
  imports: [ConfigModule, AuthModule, JwtModule],
  providers: [SocketIoGateway],
})
export class SocketIoModule {}
