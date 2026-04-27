import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocaleEntity } from '../../../../locales/infrastructure/persistence/relational/entities/locale.entity';
import { LocaleSeedService } from './locale-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocaleEntity])],
  providers: [LocaleSeedService],
  exports: [LocaleSeedService],
})
export class LocaleSeedModule {}
