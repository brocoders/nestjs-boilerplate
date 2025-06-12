import { Module } from '@nestjs/common';
import { PassphraseRepository } from '../passphrase.repository';
import { PassphraseRelationalRepository } from './repositories/passphrase.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassphraseEntity } from './entities/passphrase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PassphraseEntity])],
  providers: [
    {
      provide: PassphraseRepository,
      useClass: PassphraseRelationalRepository,
    },
  ],
  exports: [PassphraseRepository],
})
export class RelationalPassphrasePersistenceModule {}
