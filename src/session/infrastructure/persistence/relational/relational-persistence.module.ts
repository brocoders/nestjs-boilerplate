import { Module } from '@nestjs/common';
import { SessionRepository } from '../session.repository';
import { SessionPrismaRepository } from './repositories/session-prisma.repository';
import { PrismaModule } from '../../../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SessionRepository,
      useClass: SessionPrismaRepository,
    },
  ],
  exports: [SessionRepository],
})
export class RelationalSessionPersistenceModule {}
