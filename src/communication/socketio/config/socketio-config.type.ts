export interface SocketIOConfig {
  pingInterval: number;
  pingTimeout: number;
  maxHttpBufferSize: number;
  defaultReauthGraceMs: number;
  maxReauthTries: number;
}
