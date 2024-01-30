import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
// We use class-transformer in ORM entity and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an ORM entity directly in response.
import { Transform } from 'class-transformer';
import fileConfig from 'src/files/config/file.config';
import { FileConfig, FileDriver } from 'src/files/config/file-config.type';
import appConfig from 'src/config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Transform(
    ({ value }) => {
      if ((fileConfig() as FileConfig).driver === FileDriver.LOCAL) {
        return (appConfig() as AppConfig).backendDomain + value;
      } else if (
        [FileDriver.S3_PRESIGNED, FileDriver.S3].includes(
          (fileConfig() as FileConfig).driver,
        )
      ) {
        const s3 = new S3Client({
          region: (fileConfig() as FileConfig).awsS3Region ?? '',
          credentials: {
            accessKeyId: (fileConfig() as FileConfig).accessKeyId ?? '',
            secretAccessKey: (fileConfig() as FileConfig).secretAccessKey ?? '',
          },
        });

        const command = new GetObjectCommand({
          Bucket: (fileConfig() as FileConfig).awsDefaultS3Bucket ?? '',
          Key: value,
        });

        return getSignedUrl(s3, command, { expiresIn: 3600 });
      }

      return value;
    },
    {
      toPlainOnly: true,
    },
  )
  path: string;
}
