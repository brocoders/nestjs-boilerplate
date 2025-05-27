import { Module } from '@nestjs/common';
import { AccountsReceivableRepository } from '../accounts-receivable.repository';
import { AccountsReceivableRelationalRepository } from './repositories/accounts-receivable.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivableEntity } from './entities/accounts-receivable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsReceivableEntity])],
  providers: [
    {
      provide: AccountsReceivableRepository,
      useClass: AccountsReceivableRelationalRepository,
    },
  ],
  exports: [AccountsReceivableRepository],
})
export class RelationalAccountsReceivablePersistenceModule {}
