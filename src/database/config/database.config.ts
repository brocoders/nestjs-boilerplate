import { registerAs } from '@nestjs/config';

import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { DatabaseConfig } from './database-config.type';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' }); // Load environment variables FIRST
class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => envValues.DATABASE_URL)
  @IsString()
  DATABASE_URL: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_TYPE: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_HOST: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsInt()
  @Min(0)
  @Max(65535)
  DATABASE_PORT: number;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_PASSWORD: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_NAME: string;

  @ValidateIf((envValues) => !envValues.DATABASE_URL)
  @IsString()
  DATABASE_USERNAME: string;

  @IsBoolean()
  @IsOptional()
  DATABASE_SYNCHRONIZE: boolean;

  @IsInt()
  @IsOptional()
  DATABASE_MAX_CONNECTIONS: number;

  @IsBoolean()
  @IsOptional()
  DATABASE_SSL_ENABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DATABASE_REJECT_UNAUTHORIZED: boolean;

  @IsString()
  @IsOptional()
  DATABASE_CA: string;

  @IsString()
  @IsOptional()
  DATABASE_KEY: string;

  @IsString()
  @IsOptional()
  DATABASE_CERT: string;
}
export default registerAs<DatabaseConfig>('database', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    // Required properties from DatabaseConfig type
    isDocumentDatabase: ['mongodb'].includes(process.env.DATABASE_TYPE ?? ''),
    maxConnections: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,

    // Existing multi-tenant configuration
    isMultiTenant: process.env.DATABASE_MULTI_TENANT === 'true',
    core: {
      type: 'postgres',
      host: process.env.CORE_DB_HOST,
      port: parseInt(process.env.CORE_DB_PORT || '5432', 10),
      username: process.env.CORE_DB_USER,
      password: process.env.CORE_DB_PASSWORD,
      database: process.env.CORE_DB_NAME,
      synchronize: false,
    },
    tenantPrefix: process.env.TENANT_DB_PREFIX || 'tenant_',
    tenantConfig: {
      type: 'database',
      defaultHost: process.env.TENANT_DB_HOST || 'localhost',
      defaultPort: parseInt(process.env.TENANT_DB_PORT || '5432', 10),
      defaultUsername: process.env.TENANT_DB_USER || 'saka',
      defaultPassword: process.env.TENANT_DB_PASSWORD || '',
    },

    // Add other DatabaseConfig properties with defaults
    sslEnabled: process.env.DATABASE_SSL_ENABLED === 'true',
    rejectUnauthorized: process.env.DATABASE_REJECT_UNAUTHORIZED === 'true',
    ca: process.env.DATABASE_CA,
    key: process.env.DATABASE_KEY,
    cert: process.env.DATABASE_CERT,
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  };
});
