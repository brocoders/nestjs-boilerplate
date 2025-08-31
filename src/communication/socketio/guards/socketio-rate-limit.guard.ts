import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsRateLimitGuard implements CanActivate {
  private buckets = new WeakMap<Socket, { t: number; tokens: number }>();
  private limit = 20; // tokens per window
  private windowMs = 10_000; // 10s

  canActivate(ctx: ExecutionContext): boolean {
    const socket = ctx.switchToWs().getClient<Socket>();
    const now = Date.now();
    const bucket = this.buckets.get(socket) ?? { t: now, tokens: this.limit };
    const elapsed = now - bucket.t;

    if (elapsed > this.windowMs) {
      bucket.t = now;
      bucket.tokens = this.limit;
    }
    if (bucket.tokens <= 0) return false;

    bucket.tokens -= 1;
    this.buckets.set(socket, bucket);
    return true;
  }
}
