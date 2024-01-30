import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
import { Transform } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { AppConfig } from 'src/config/app-config.type';
import appConfig from 'src/config/app.config';
import { FileConfig, FileDriver } from 'src/files/config/file-config.type';
import fileConfig from 'src/files/config/file.config';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type FileSchemaDocument = HydratedDocument<FileSchemaClass>;

@Schema({
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FileSchemaClass extends EntityDocumentHelper {
  @Prop()
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

export const FileSchema = SchemaFactory.createForClass(FileSchemaClass);
