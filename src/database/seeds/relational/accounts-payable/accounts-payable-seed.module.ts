import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsPayableEntity } from '../../../../accounts-payables/infrastructure/persistence/relational/entities/accounts-payable.entity';
import { AccountsPayableSeedService } from './accounts-payable-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsPayableEntity])],
  providers: [AccountsPayableSeedService],
  exports: [AccountsPayableSeedService],
})
export class AccountsPayableSeedModule {}
