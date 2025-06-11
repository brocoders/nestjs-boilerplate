import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocketIoAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticateSocket(socket: Socket): Promise<{ userId: string }> {
    const token = socket.handshake.auth?.token;

    if (!token) {
      throw new UnauthorizedException('Missing auth token');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authService['configService'].getOrThrow('auth.secret', {
          infer: true,
        }),
      });

      if (!payload?.id) {
        throw new UnauthorizedException('User not found in token');
      }

      socket.data.userId = payload.id;
      return { userId: payload.id };
    } catch (_err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
