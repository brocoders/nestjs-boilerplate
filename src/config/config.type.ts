import { AppConfig } from './app-config.type';
import { AppleConfig } from '../auth-apple/config/apple-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FacebookConfig } from '../auth-facebook/config/facebook-config.type';
import { FileConfig } from '../files/config/file-config.type';
import { GoogleConfig } from '../auth-google/config/google-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { TwitterConfig } from '../auth-twitter/config/twitter-config.type';

export type AllConfigType = {
  app: AppConfig;
  apple: AppleConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  facebook: FacebookConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
  twitter: TwitterConfig;
};
