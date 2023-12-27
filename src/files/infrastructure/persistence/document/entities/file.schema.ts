import appConfig from '../../../../../config/app.config';
import { AppConfig } from 'src/config/app-config.type';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type FileSchemaDocument = HydratedDocument<FileSchemaClass>;

@Schema({
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class FileSchemaClass extends EntityDocumentHelper {
  @Prop({
    get: (value) => {
      if (value.indexOf('/') === 0) {
        return (appConfig() as AppConfig).backendDomain + value;
      }

      return value;
    },
  })
  path: string;
}

export const FileSchema = SchemaFactory.createForClass(FileSchemaClass);
