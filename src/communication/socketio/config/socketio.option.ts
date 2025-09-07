import { ConfigService } from '@nestjs/config';
import { SocketIOConfig } from './socketio-config.type';

export const socketIoOptionsFactory = (
  configService: ConfigService,
): SocketIOConfig => ({
  pingInterval: configService.get<number>('socketIO.pingInterval', {
    infer: true,
  }),
  pingTimeout: configService.get<number>('socketIO.pingTimeout', {
    infer: true,
  }),
  maxHttpBufferSize: configService.get<number>('socketIO.maxHttpBufferSize', {
    infer: true,
  }),
  defaultReauthGraceMs: configService.get<number>(
    'socketIO.defaultReauthGraceMs',
    { infer: true },
  ),
  maxReauthTries: configService.get<number>('socketIO.maxReauthTries', {
    infer: true,
  }),
});
