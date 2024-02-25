import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SessionService } from '../session/session.service';

@Injectable()
export class AuthSessionGuard extends AuthGuard('jwt') {
  constructor(private sessionService: SessionService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasSession = await this.sessionService.findOne({
      id: user.sessionId,
    });

    if (!hasSession) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
