import { Module } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UsersPrismaRepository } from './repositories/user-prisma.repository';
import { PrismaModule } from '../../../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersPrismaRepository,
    },
  ],
  exports: [UserRepository],
})
export class RelationalUserPersistenceModule {}
