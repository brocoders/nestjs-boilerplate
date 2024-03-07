import { Session } from 'src/session/domain/session';

export type JwtRefreshPayloadType = {
  sessionId: Session['id'];
  hash: Session['hash'];
  iat: number;
  exp: number;
};
