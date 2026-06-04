import { Module } from '@nestjs/common';

import { UserRepository } from '../user.repository';
import { UsersPrismaRepository } from './repositories/user.repository';

@Module({
  providers: [
    {
      provide: UserRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class PrismaUserPersistenceModule {}
