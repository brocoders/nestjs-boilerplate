import { Global, Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { LoggerModule } from '../../common/logger/logger.module';
import { UsersModule } from '../../users/users.module';
import { SocketIoGateway } from './socketio.gateway';
import { SocketIoAuthService } from './services/socketio.auth.service';
import { SocketIoRoleGuard } from './guards/socketio-role.guard';
import { SocketServerProvider } from './utils/socketio.provider';
import { SocketIoController } from './socketio.controller';
import { SocketIoService } from './socketio.service';

@Global()
@Module({
  imports: [AuthModule, LoggerModule, forwardRef(() => UsersModule)],
  providers: [
    SocketIoGateway,
    SocketIoAuthService,
    SocketIoRoleGuard,
    SocketServerProvider,
    SocketIoService,
  ],
  controllers: [SocketIoController],
  exports: [SocketServerProvider, SocketIoService],
})
export class SocketIoModule {}
