import { registerAs } from '@nestjs/config';
import { FileConfig } from './config.type';

export default registerAs<FileConfig>('file', () => ({
  driver: process.env.FILE_DRIVER ?? 'local',
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
  awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
  awsS3Region: process.env.AWS_S3_REGION,
  maxFileSize: 5242880, // 5mb
}));
