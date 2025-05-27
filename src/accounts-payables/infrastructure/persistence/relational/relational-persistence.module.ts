import { Module } from '@nestjs/common';
import { AccountsPayableRepository } from '../accounts-payable.repository';
import { AccountsPayableRelationalRepository } from './repositories/accounts-payable.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableEntity } from './entities/accounts-payable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsPayableEntity])],
  providers: [
    {
      provide: AccountsPayableRepository,
      useClass: AccountsPayableRelationalRepository,
    },
  ],
  exports: [AccountsPayableRepository],
})
export class RelationalAccountsPayablePersistenceModule {}
