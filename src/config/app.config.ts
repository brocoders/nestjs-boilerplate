import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import appPkg from '../../package.json';
import { NodeEnv } from '../utils/types/gobal.type';

class EnvironmentVariablesValidator {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_VERSION: string;

  @IsString()
  @IsOptional()
  DATABASE_TYPE: string;

  @IsString()
  @IsOptional()
  DOCS_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const _port = process.env.APP_PORT
    ? parseInt(process.env.APP_PORT, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : 3000;
  return {
    nodeEnv: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
    name: process.env.APP_NAME || 'app',
    version: process.env.APP_VERSION || (appPkg as any).version,
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: _port,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    dbType: process.env.DATABASE_TYPE || 'postgres',
    monitorSampleMs: process.env.MONITOR_SAMPLE_MS
      ? parseInt(process.env.MONITOR_SAMPLE_MS, 10)
      : 10000,
    docsUrl: process.env.DOCS_URL || `http://localhost:${_port}/apps/docs`,
  };
});
