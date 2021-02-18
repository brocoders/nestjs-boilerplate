import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twitter from 'twitter';
import { Tokens } from '../social/tokens';
import { SocialInterface } from '../social/interfaces/social.interface';

@Injectable()
export class TwitterService {
  constructor(private configService: ConfigService) {}

  async getProfileByToken(tokens: Tokens): Promise<SocialInterface> {
    const twitter = new Twitter({
      consumer_key: this.configService.get('twitter.consumerKey'),
      consumer_secret: this.configService.get('twitter.consumerSecret'),
      access_token_key: tokens.token1,
      access_token_secret: tokens.token2,
    });

    const data: Twitter.ResponseData = await new Promise(resolve => {
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
      email: data.email?.toLowerCase(),
      firstName: data.name,
    };
  }
}
