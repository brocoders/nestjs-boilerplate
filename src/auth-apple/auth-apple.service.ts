import { Injectable } from '@nestjs/common';
import appleSigninAuth from 'apple-signin-auth';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';

@Injectable()
export class AuthAppleService {
  constructor(private configService: ConfigService) {}

  async getProfileByToken(
    loginDto: AuthAppleLoginDto,
  ): Promise<SocialInterface> {
    const data = await appleSigninAuth.verifyIdToken(loginDto.idToken, {
      audience: this.configService.get('apple.appAudience'),
    });

    return {
      id: data.sub,
      email: data.email,
      firstName: loginDto.firstName,
      lastName: loginDto.lastName,
    };
  }
}
