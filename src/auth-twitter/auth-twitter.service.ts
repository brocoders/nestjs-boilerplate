import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twitter from 'twitter';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';

@Injectable()
export class AuthTwitterService {
  constructor(private configService: ConfigService) {}

  async getProfileByToken(
    loginDto: AuthTwitterLoginDto,
  ): Promise<SocialInterface> {
    const twitter = new Twitter({
      consumer_key: this.configService.get('twitter.consumerKey'),
      consumer_secret: this.configService.get('twitter.consumerSecret'),
      access_token_key: loginDto.accessTokenKey,
      access_token_secret: loginDto.accessTokenSecret,
    });

    const data: Twitter.ResponseData = await new Promise((resolve) => {
      twitter.get(
        'account/verify_credentials',
        { include_email: true },
        (error, profile) => {
          resolve(profile);
        },
      );
    });

    return {
      id: data.id.toString(),
      email: data.email,
      firstName: data.name,
    };
  }
}
