import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import ms from 'ms';
import validateConfig from '../../../../common/utils/validate-config';
import { EmailAuthConfig } from './email-auth-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;
}

export default registerAs<EmailAuthConfig>('emailAuth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN as ms.StringValue,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env
      .AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN as ms.StringValue,
  };
});
