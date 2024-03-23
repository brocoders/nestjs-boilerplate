import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSeedService } from './user-seed.service';
import {
  UserSchemaClass,
  UserSchema,
} from '../../../../users/infrastructure/persistence/document/entities/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaClass.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
