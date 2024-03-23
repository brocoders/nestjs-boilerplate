import { Injectable } from '@nestjs/common';
import { Facebook } from 'fb';
import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { FacebookInterface } from './interfaces/facebook.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from '../config/config.type';

@Injectable()
export class AuthFacebookService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    const fb: Facebook = new Facebook({
      appId: this.configService.get('facebook.appId', {
        infer: true,
      }),
      appSecret: this.configService.get('facebook.appSecret', {
        infer: true,
      }),
      version: 'v7.0',
    });
    fb.setAccessToken(loginDto.accessToken);

    const data: FacebookInterface = await new Promise((resolve) => {
      fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response) => {
          resolve(response);
        },
      );
    });

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  }
}
