import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
import { Exclude, Expose, Type } from 'class-transformer';
import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { Role } from '../../../../../roles/domain/role';
import { Status } from '../../../../../statuses/domain/status';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  email: string | null;

  @Exclude({ toPlainOnly: true })
  @Prop()
  password?: string;

  @Exclude({ toPlainOnly: true })
  previousPassword?: string;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @Prop({
    type: String,
  })
  firstName: string | null;

  @Prop({
    type: String,
  })
  lastName: string | null;

  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  photo?: FileSchemaClass | null;

  @Prop({
    type: Role,
  })
  role?: Role | null;

  @Prop({
    type: Status,
  })
  status?: Status;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});

UserSchema.index({ 'role.id': 1 });
