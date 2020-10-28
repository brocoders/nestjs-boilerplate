import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  domain: process.env.APP_DOMAIN,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
}));
