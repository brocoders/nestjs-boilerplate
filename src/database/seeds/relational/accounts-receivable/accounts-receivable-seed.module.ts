import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountsReceivableEntity } from '../../../../accounts-receivables/infrastructure/persistence/relational/entities/accounts-receivable.entity';
import { AccountsReceivableSeedService } from './accounts-receivable-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AccountsReceivableEntity])],
  providers: [AccountsReceivableSeedService],
  exports: [AccountsReceivableSeedService],
})
export class AccountsReceivableSeedModule {}
