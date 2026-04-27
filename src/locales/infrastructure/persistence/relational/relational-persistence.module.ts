import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleAbstractRepository } from '../locale.abstract.repository';
import { LocaleEntity } from './entities/locale.entity';
import { LocaleRelationalRepository } from './repositories/locale.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LocaleEntity])],
  providers: [
    {
      provide: LocaleAbstractRepository,
      useClass: LocaleRelationalRepository,
    },
  ],
  exports: [LocaleAbstractRepository],
})
export class RelationalLocalePersistenceModule {}
