import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthGoogleLoginDto } from './dto/auth-google-login.dto';
import { TokenPayload } from 'google-auth-library/build/src/auth/loginticket';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.google = new OAuth2Client(
      configService.get('google.clientId'),
      configService.get('google.clientSecret'),
    );
  }

  async getProfileByToken(
    loginDto: AuthGoogleLoginDto,
  ): Promise<SocialInterface> {
    const ticket: LoginTicket = await this.google.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [this.configService.get('google.clientId')],
    });

    const data: TokenPayload = ticket.getPayload();

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }
}
