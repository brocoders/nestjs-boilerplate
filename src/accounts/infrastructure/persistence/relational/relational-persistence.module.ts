import { Module } from '@nestjs/common';
import { AccountRepository } from '../account.repository';
import { AccountRelationalRepository } from './repositories/account.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [
    {
      provide: AccountRepository,
      useClass: AccountRelationalRepository,
    },
  ],
  exports: [AccountRepository],
})
export class RelationalAccountPersistenceModule {}
