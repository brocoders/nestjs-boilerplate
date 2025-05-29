import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';
import { TransactionSeedService } from './transaction-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
  providers: [TransactionSeedService],
  exports: [TransactionSeedService],
})
export class TransactionSeedModule {}
