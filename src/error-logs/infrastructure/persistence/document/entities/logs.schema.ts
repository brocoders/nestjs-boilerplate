import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, now } from 'mongoose';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { Logs } from '@/error-logs/domain/logs';

export type LogsSchemaDocument = HydratedDocument<LogsSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class LogsSchemaClass extends EntityDocumentHelper implements Logs {
  @Prop({
    type: SchemaTypes.String,
    unique: true,
  })
  id: string;

  @Prop()
  path: string;

  @Prop({ type: Object })
  message: JSON;

  @Prop({ type: Object })
  stack: JSON;
  
  @Prop()
  method: string;
  
  @Prop({ type: Object })
  payload?: JSON | null;
  
  @Prop()
  status: number;

  @Prop({ default: now })
  timestamp: Date;
}

export const LogsSchema = SchemaFactory.createForClass(LogsSchemaClass);
