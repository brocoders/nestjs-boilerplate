import { registerAs } from '@nestjs/config';
import { FacebookConfig } from './config.type';

export default registerAs<FacebookConfig>('facebook', () => ({
  appId: process.env.FACEBOOK_APP_ID,
  appSecret: process.env.FACEBOOK_APP_SECRET,
}));
