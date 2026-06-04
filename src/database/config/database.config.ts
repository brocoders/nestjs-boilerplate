import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { DatabaseConfig } from './database-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  CLOUDFLARE_ACCOUNT_ID: string;

  @IsString()
  @IsOptional()
  CLOUDFLARE_D1_TOKEN: string;

  @IsString()
  @IsOptional()
  CLOUDFLARE_DATABASE_ID: string;

  @IsString()
  @IsOptional()
  CLOUDFLARE_SHADOW_DATABASE_ID: string;

  @IsString()
  @IsOptional()
  CLOUDFLARE_DATABASE_NAME: string;
}

export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    shadowDatabaseId: process.env.CLOUDFLARE_SHADOW_DATABASE_ID,
    databaseName: process.env.CLOUDFLARE_DATABASE_NAME,
  };
});
