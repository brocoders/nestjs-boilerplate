import { Module } from '@nestjs/common';

import { SessionRepository } from '../session.repository';
import { SessionPrismaRepository } from './repositories/session.repository';

@Module({
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionPrismaRepository,
    },
  ],
  exports: [SessionRepository],
})
export class PrismaSessionPersistenceModule {}
