import ms from 'ms';

export type AuthConfig = {
  secret?: string;
  expires?: ms.StringValue;
  refreshSecret?: string;
  refreshExpires?: ms.StringValue;
};
