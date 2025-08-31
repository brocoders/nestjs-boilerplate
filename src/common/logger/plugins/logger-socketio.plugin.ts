import chalk from 'chalk';
import type { Server, Socket } from 'socket.io';
import { JwtPayloadType } from '../../../auth/strategies/types/jwt-payload.type';

/**
 * Socket.IO logger plugin
 *
 * Mirrors the style of LoggerPlugin (HTTP) with extract/format helpers.
 * All logs are ASCII/English-only for downstream compatibility.
 */
export class LoggerSocketIoPlugin {
  /** Build a minimal snapshot of a socket for logging */
  static extractSocketContext(socket: Socket) {
    const user = (socket.data?.user ?? null) as
      | (JwtPayloadType & { email?: string; role?: any })
      | null;

    const ns = socket.nsp?.name ?? '/';
    const sid = socket.id;
    const ip = socket.handshake?.address || '';
    const userId = user?.id ?? 'anonymous';
    const role = (user?.role as any)?.id ?? user?.role ?? 'guest';
    const userEmail = (user as any)?.email ?? undefined;
    const startTime = (socket as any)['__startTime'] || Date.now();

    return { ns, sid, ip, userId, role, userEmail, startTime };
  }

  /** Build a minimal snapshot for gateway init */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static extractInitContext(server: Server) {
    // Server does not expose many props; keep it simple and stable.
    return { ns: '/ws' };
  }

  /** Build an event context */
  static extractEventContext(socket: Socket, event: string, payload?: unknown) {
    const base = this.extractSocketContext(socket);
    const size = this.sizeOf(payload);
    return { ...base, event, size };
  }

  /** Approximate JSON payload size in bytes */
  static sizeOf(payload: unknown): number {
    try {
      return Buffer.byteLength(JSON.stringify(payload ?? {}));
    } catch {
      return 0;
    }
  }

  /** Format a connection log line */
  static formatConnectLogContext(
    source: string,
    ns: string,
    sid: string,
    ip: string,
    userId: string,
    role: string | undefined,
    duration: number,
  ): string {
    const coloredSource = chalk.magentaBright(source);
    const coloredAction = chalk.greenBright('CONNECT');
    const responseTime = chalk.gray(`+${duration}ms`);
    return `[${coloredSource}] [${coloredAction}] [ns:${ns}] [sid:${sid}] [${ip}] [user:${userId},${role}] ${responseTime}`;
  }

  /** Format a disconnection log line */
  static formatDisconnectLogContext(
    source: string,
    ns: string,
    sid: string,
    ip: string,
    userId: string,
    role: string | undefined,
    reason: string | undefined,
    duration: number,
  ): string {
    const coloredSource = chalk.magentaBright(source);
    const coloredAction = chalk.yellowBright('DISCONNECT');
    const responseTime = chalk.gray(`+${duration}ms`);
    const reasonText = reason ? ` reason:${reason}` : '';
    const userPart = role ? `[user:${userId},${role}]` : `[user:${userId}]`;
    return `[${coloredSource}] [${coloredAction}] [ns:${ns}] [sid:${sid}] [${ip}]${userPart}${reasonText} ${responseTime}`;
  }

  /** Format a generic event log line */
  static formatEventLogContext(
    source: string,
    ns: string,
    sid: string,
    ip: string,
    userId: string | number,
    role: string | undefined,
    event: string,
    size: number,
    duration: number,
  ): string {
    const coloredSource = chalk.magentaBright(source);
    const coloredAction = chalk.cyanBright('EVENT');
    const responseTime = chalk.gray(`+${duration}ms`);
    // If role exists, include [user:${userId},${role}], else [user:${userId}]
    const userPart = role ? `[user:${userId},${role}]` : `[user:${userId}]`;
    return `[${coloredSource}] [${coloredAction}::${event}] [ns:${ns}] [sid:${sid}] [${ip}] ${userPart} [size:${size}b] ${responseTime}`;
  }

  /** Format an auth result log line */
  static formatAuthLogContext(
    source: string,
    ns: string,
    sid: string,
    ip: string,
    userId: string,
    role: string | undefined,
    ok: boolean,
    reason?: string,
  ): string {
    const coloredSource = chalk.magentaBright(source);
    const tag = ok
      ? chalk.greenBright('AUTH_OK')
      : chalk.redBright('AUTH_FAIL');
    const reasonText = reason ? ` reason:${reason}` : '';
    return `[${coloredSource}] [${tag}] [ns:${ns}] [sid:${sid}] [${ip}] [user:${userId},${role}]${reasonText}`;
  }
}
