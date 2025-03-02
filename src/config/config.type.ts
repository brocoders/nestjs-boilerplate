import { AppConfig } from './app-config.type';
import { AppleConfig } from '../auth-apple/config/apple-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { FileConfig } from '../files/config/file-config.type';
import { GoogleConfig } from '../auth-google/config/google-config.type';
import { MailConfig } from '../mail/config/mail-config.type';
import { VeroConfig } from 'src/auth-vero/config/vero-config.type';
import { GorushConfig } from 'src/providers/gorush/config/gorush-config.type';
import { CommunicationConfig } from 'src/communication/config/communication-config.type';

export type AllConfigType = {
  app: AppConfig;
  apple: AppleConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  file: FileConfig;
  google: GoogleConfig;
  mail: MailConfig;
  vero: VeroConfig;
  gorush: GorushConfig;
  communication: CommunicationConfig;
};
