import { registerAs } from '@nestjs/config';
import { GoogleConfig } from './config.type';

export default registerAs<GoogleConfig>('google', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}));
