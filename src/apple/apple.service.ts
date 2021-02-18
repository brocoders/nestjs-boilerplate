import { Injectable } from '@nestjs/common';
import appleSigninAuth from 'apple-signin-auth';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '../social/tokens';
import { SocialInterface } from '../social/interfaces/social.interface';

@Injectable()
export class AppleService {
  constructor(private configService: ConfigService) {}

  async getProfileByToken(tokens: Tokens): Promise<SocialInterface> {
    const data = await appleSigninAuth.verifyIdToken(tokens.token1, {
      audience: this.configService.get('apple.appAudience'),
    });

    return {
      id: data.sub,
      email: data.email?.toLowerCase(),
    };
  }
}
