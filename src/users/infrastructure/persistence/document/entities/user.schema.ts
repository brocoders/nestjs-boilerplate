import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
import { Exclude, Expose, Type } from 'class-transformer';
import { AuthProvidersEnum } from '../../../../../auth/auth-providers.enum';
import { FileSchemaClass } from '../../../../../files/infrastructure/persistence/document/entities/file.schema';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { StatusSchema } from '../../../../../statuses/infrastructure/persistence/document/entities/status.schema';
import { RoleSchema } from '../../../../../roles/infrastructure/persistence/document/entities/role.schema';
import { ApiResponseProperty } from '@nestjs/swagger';

export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class UserSchemaClass extends EntityDocumentHelper {
  @ApiResponseProperty({
    type: String,
    example: 'john.doe@example.com',
  })
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

  @ApiResponseProperty({
    type: String,
    example: 'email',
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    default: AuthProvidersEnum.email,
  })
  provider: string;

  @ApiResponseProperty({
    type: String,
    example: '1234567890',
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  @Prop({
    type: String,
    default: null,
  })
  socialId?: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'John',
  })
  @Prop({
    type: String,
  })
  firstName: string | null;

  @ApiResponseProperty({
    type: String,
    example: 'Doe',
  })
  @Prop({
    type: String,
  })
  lastName: string | null;

  @ApiResponseProperty({
    type: () => FileSchemaClass,
  })
  @Prop({
    type: FileSchemaClass,
  })
  @Type(() => FileSchemaClass)
  photo?: FileSchemaClass | null;

  @ApiResponseProperty({
    type: () => RoleSchema,
  })
  @Prop({
    type: RoleSchema,
  })
  role?: RoleSchema | null;

  @ApiResponseProperty({
    type: () => StatusSchema,
  })
  @Prop({
    type: StatusSchema,
  })
  status?: StatusSchema;

  @ApiResponseProperty()
  @Prop({ default: now })
  createdAt: Date;

  @ApiResponseProperty()
  @Prop({ default: now })
  updatedAt: Date;

  @ApiResponseProperty()
  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

UserSchema.virtual('previousPassword').get(function () {
  return this.password;
});

UserSchema.index({ 'role._id': 1 });
