export class WsError {
  private constructor(
    public readonly code: string,
    public readonly message: string,
  ) {}

  static readonly JWT_MISSING = new WsError(
    'JWT_MISSING',
    'Missing JWT. Provide it in handshake.auth.token or Authorization: Bearer <token>.',
  );
  static readonly UNAUTHORIZED = new WsError(
    'UNAUTHORIZED',
    'Invalid or expired token',
  );
  static readonly REAUTH_FAILED = new WsError(
    'REAUTH_FAILED',
    'Invalid or expired token',
  );
  static readonly FORBIDDEN = new WsError('FORBIDDEN', 'Forbidden');
  static readonly REAUTH_WINDOW_CLOSED = new WsError(
    'REAUTH_WINDOW_CLOSED',
    'Re-auth window closed',
  );
  static readonly REAUTH_TOO_MANY_ATTEMPTS = new WsError(
    'REAUTH_TOO_MANY_ATTEMPTS',
    'Too many re-auth attempts',
  );
  static readonly JWT_EXPIRED = new WsError('JWT_EXPIRED', 'JWT token expired');
  static readonly JWT_INVALID = new WsError(
    'JWT_INVALID',
    'JWT token not valid',
  );
  static readonly JWT_NOT_ACTIVE = new WsError(
    'JWT_NOT_ACTIVE',
    'JWT token not active yet',
  );
  static readonly JWT_FORBIDDEN = new WsError(
    'JWT_FORBIDDEN',
    'JWT token forbidden',
  );
  static readonly AUTH_UNKNOWN_ERROR = new WsError(
    'AUTH_UNKNOWN_ERROR',
    'Authentication failed',
  );
}

export type WsAuthErrorReason =
  | 'JWT_MISSING'
  | 'JWT_EXPIRED'
  | 'JWT_INVALID'
  | 'JWT_NOT_ACTIVE'
  | 'JWT_FORBIDDEN'
  | 'AUTH_UNKNOWN_ERROR';

export type WsErrorCode =
  | 'JWT_MISSING'
  | 'UNAUTHORIZED'
  | 'REAUTH_FAILED'
  | 'FORBIDDEN'
  | 'REAUTH_WINDOW_CLOSED'
  | 'REAUTH_TOO_MANY_ATTEMPTS'
  | 'JWT_EXPIRED'
  | 'JWT_INVALID'
  | 'JWT_NOT_ACTIVE'
  | 'JWT_FORBIDDEN'
  | 'AUTH_UNKNOWN_ERROR';

export interface WsErrorEnvelope<T = any> {
  code: WsErrorCode;
  message: string;
  data?: T;
}
