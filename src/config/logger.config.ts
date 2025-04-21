import { IsEnum, IsOptional, IsString } from 'class-validator';

import { registerAs } from '@nestjs/config';

import validateConfig from '../utils/validate-config';

enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

class EnvironmentVariablesValidator {
  @IsEnum(LogLevel)
  @IsOptional()
  LOG_LEVEL: LogLevel;

  @IsString()
  @IsOptional()
  LOG_PRETTY: string;
}

export default registerAs('logger', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    level: process.env.LOG_LEVEL || 'info',
    pretty: process.env.LOG_PRETTY === 'true',
  };
});
