import {
  // common
  Module,
} from '@nestjs/common';
import { PrismaSessionPersistenceModule } from './infrastructure/persistence/prisma/prisma-persistence.module';
import { SessionService } from './session.service';

const infrastructurePersistenceModule = PrismaSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  providers: [SessionService],
  exports: [SessionService, infrastructurePersistenceModule],
})
export class SessionModule {}
