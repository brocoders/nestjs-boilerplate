import { Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import { ConfigService } from '@nestjs/config';
import { Tokens } from '../social/tokens';
import { SocialInterface } from '../social/interfaces/social.interface';
import { FacebookInterface } from './interfaces/facebook.interface';

@Injectable()
export class FacebookService {
  private fb;

  constructor(private configService: ConfigService) {
    this.fb = new Facebook({
      appId: configService.get('facebook.appId'),
      appSecret: configService.get('facebook.appSecret'),
      version: 'v7.0',
    });
  }

  async getProfileByToken(tokens: Tokens): Promise<SocialInterface> {
    this.fb.setAccessToken(tokens.token1);

    const data: FacebookInterface = await new Promise(resolve => {
      this.fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        response => {
          resolve(response);
        },
      );
    });

    return {
      id: data.id,
      email: data.email?.toLowerCase(),
      firstName: data.first_name,
      lastName: data.last_name,
    };
  }
}
