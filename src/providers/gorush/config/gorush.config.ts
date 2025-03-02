import { registerAs } from '@nestjs/config';
import { IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';
import { GorushConfig } from './gorush-config.type';
import {
  GORUSH_DEFAULT_ENABLE,
  GORUSH_DEFAULT_GRPC_PORT,
  GORUSH_DEFAULT_URL,
  GORUSH_TIMEOUT_INTERVAL,
} from '../types/gorush-const.type';
import validateConfig from '../../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  GORUSH_URL: string;

  @IsInt()
  @Min(9000)
  @Max(65535)
  GORUSH_GRPC_PORT: number;

  @IsBoolean()
  GORUSH_ENABLE: boolean;

  @IsInt()
  @Min(5000)
  @Max(10000)
  GORUSH_REQUEST_TIMEOUT: number;
}

export default registerAs<GorushConfig>('gorush', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    baseUrl: process.env.GORUSH_URL || GORUSH_DEFAULT_URL,
    grpcPort: process.env.GORUSH_GRPC_PORT
      ? parseInt(process.env.GORUSH_GRPC_PORT, 10)
      : GORUSH_DEFAULT_GRPC_PORT,
    enabled: process.env.GORUSH_ENABLE === 'true' || GORUSH_DEFAULT_ENABLE,
    requestTimeOut: process.env.GORUSH_REQUEST_TIMEOUT
      ? parseInt(process.env.GORUSH_REQUEST_TIMEOUT, 10)
      : GORUSH_TIMEOUT_INTERVAL,
  };
});
