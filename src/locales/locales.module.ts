import { Module } from '@nestjs/common';
import { LocalesController } from './locales.controller';
import { LocalesService } from './locales.service';
import { RelationalLocalePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalLocalePersistenceModule],
  controllers: [LocalesController],
  providers: [LocalesService],
  exports: [LocalesService],
})
export class LocalesModule {}
