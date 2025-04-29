import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { MinIOConfig } from './minio-config.type';
import {
  MINIO_ENABLE,
  MINIO_PORT,
  MINIO_S3_HOST,
  MINIO_USE_SSL,
} from '../types/minio-const';
import { createToggleableConfig } from '../../../config/config.helper';

class MinioEnvValidator {
  @IsString()
  MINIO_S3_HOST: string;

  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsString()
  MINIO_SECRET_KEY: string;

  @IsBoolean()
  MINIO_USE_SSL: boolean;

  @IsBoolean()
  MINIO_ENABLE: boolean;

  @IsNumber()
  MINIO_PORT: number;
}

export default createToggleableConfig<MinIOConfig>(
  'minIO',
  MinioEnvValidator,
  {
    host: MINIO_S3_HOST,
    accessKey: '',
    secretKey: '',
    useSSL: MINIO_USE_SSL,
    enable: MINIO_ENABLE,
    port: MINIO_PORT,
  },
  'enable',
  'MINIO_ENABLE',
);
