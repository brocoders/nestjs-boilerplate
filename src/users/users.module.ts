import {
  // common
  Module,
} from '@nestjs/common';

import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { PrismaUserPersistenceModule } from './infrastructure/persistence/prisma/prisma-persistence.module';
import { FilesModule } from '../files/files.module';

const infrastructurePersistenceModule = PrismaUserPersistenceModule;

@Module({
  imports: [
    // import modules, etc.
    infrastructurePersistenceModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule],
})
export class UsersModule {}
