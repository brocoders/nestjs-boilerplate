import { Module } from '@nestjs/common';

import { FileRepository } from '../file.repository';
import { FilePrismaRepository } from './repositories/file.repository';

@Module({
  providers: [
    {
      provide: FileRepository,
      useClass: FilePrismaRepository,
    },
  ],
  exports: [FileRepository],
})
export class PrismaFilePersistenceModule {}
