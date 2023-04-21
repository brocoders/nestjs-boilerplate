import { registerAs } from '@nestjs/config';
import { AppleConfig } from './config.type';

export default registerAs<AppleConfig>('apple', () => ({
  appAudience: JSON.parse(process.env.APPLE_APP_AUDIENCE ?? '[]'),
}));
