import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../database/prisma.module';
import { FileRepository } from '../file.repository';
import { FilePrismaRepository } from './repositories/file-prisma.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: FileRepository,
      useClass: FilePrismaRepository,
    },
  ],
  exports: [FileRepository],
})
export class RelationalFilePersistenceModule {}
