import { registerAs } from '@nestjs/config';
import { IsBoolean, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { MinIOConfig } from './minio-config.type';

class EnvValidator {
  @IsString()
  MINIO_S3_HOST: string;

  @IsString()
  MINIO_ACCESS_KEY: string;

  @IsString()
  MINIO_SECRET_KEY: string;

  @IsBoolean()
  MINIO_USE_SSL: boolean;
}

export default registerAs<MinIOConfig>('minio', () => {
  validateConfig(process.env, EnvValidator);

  return {
    minioHost: process.env.MINIO_S3_HOST!,
    minioAccessKey: process.env.MINIO_ACCESS_KEY!,
    minioSecretKey: process.env.MINIO_SECRET_KEY!,
    minioUseSSL: process.env.MINIO_USE_SSL === 'true',
  };
});
