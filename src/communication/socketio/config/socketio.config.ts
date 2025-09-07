import { registerAs } from '@nestjs/config';
import {
  SOCKETIO_DEFAULT_PING_INTERVAL,
  SOCKETIO_DEFAULT_PING_TIMEOUT,
  SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
  SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
} from '../types/socketio-const.type';

const intFromEnv = (key: string, fallback: number): number => {
  const raw = process.env[key];
  const n = parseInt(raw ?? '', 10);
  return Number.isFinite(n) ? n : fallback;
};

export default registerAs('socketIO', () => ({
  pingInterval: intFromEnv(
    'SOCKETIO_PING_INTERVAL',
    SOCKETIO_DEFAULT_PING_INTERVAL,
  ),
  pingTimeout: intFromEnv(
    'SOCKETIO_PING_TIMEOUT',
    SOCKETIO_DEFAULT_PING_TIMEOUT,
  ),
  maxHttpBufferSize: intFromEnv(
    'SOCKETIO_MAX_HTTP_BUFFER_SIZE',
    SOCKETIO_DEFAULT_MAX_HTTP_BUFFER_SIZE,
  ),
  defaultReauthGraceMs: intFromEnv(
    'SOCKETIO_DEFAULT_REAUTH_GRACE_MS',
    SOCKETIO_DEFAULT_REAUTH_GRACE_MS,
  ),
  maxReauthTries: intFromEnv(
    'SOCKETIO_MAX_REAUTH_TRIES',
    SOCKETIO_DEFAULT_MAX_REAUTH_TRIES,
  ),
}));
