import { AppConfig } from './app-config.type';
import { AuthConfig } from '../../auth/config/auth-config.type';
import { EmailAuthConfig } from '../../auth/providers/email/config/email-auth-config.type';
import { FacebookConfig } from '../../auth/providers/facebook/config/facebook-config.type';
import { FileConfig } from '../../files/config/file-config.type';
import { GoogleConfig } from '../../auth/providers/google/config/google-config.type';
import { MailConfig } from '../../mail/config/mail-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  emailAuth: EmailAuthConfig;
  facebook: FacebookConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
};
