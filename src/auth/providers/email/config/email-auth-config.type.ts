import ms from 'ms';

export type EmailAuthConfig = {
  forgotSecret?: string;
  forgotExpires?: ms.StringValue;
  confirmEmailSecret?: string;
  confirmEmailExpires?: ms.StringValue;
};
