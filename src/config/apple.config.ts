import { registerAs } from '@nestjs/config';

export default registerAs('apple', () => ({
  appId: process.env.APPLE_APP_ID,
}));
