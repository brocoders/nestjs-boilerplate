import { registerAs } from '@nestjs/config';

export default registerAs('apple', () => ({
  appAudience: JSON.parse(process.env.APPLE_APP_AUDIENCE),
}));
