import { Transaction } from '../../../../domain/transaction';
import { PaymentMapper } from '../../../../../payments/infrastructure/persistence/relational/mappers/payment.mapper';

import { AccountMapper } from '../../../../../accounts/infrastructure/persistence/relational/mappers/account.mapper';

import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionMapper {
  static toDomain(raw: TransactionEntity): Transaction {
    const domainEntity = new Transaction();
    if (raw.payment) {
      domainEntity.payment = PaymentMapper.toDomain(raw.payment);
    }

    domainEntity.creditAccountName = raw.creditAccountName;

    domainEntity.debitAccountName = raw.debitAccountName;

    domainEntity.creditAmount = raw.creditAmount;

    domainEntity.debitAmount = raw.debitAmount;

    domainEntity.owner = raw.owner;

    if (raw.creditAccount) {
      domainEntity.creditAccount = raw.creditAccount.map((item) =>
        AccountMapper.toDomain(item),
      );
    }

    if (raw.debitAccount) {
      domainEntity.debitAccount = raw.debitAccount.map((item) =>
        AccountMapper.toDomain(item),
      );
    }

    domainEntity.amount = raw.amount;

    domainEntity.description = raw.description;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Transaction): TransactionEntity {
    const persistenceEntity = new TransactionEntity();
    if (domainEntity.payment) {
      persistenceEntity.payment = PaymentMapper.toPersistence(
        domainEntity.payment,
      );
    }

    persistenceEntity.creditAccountName = domainEntity.creditAccountName;

    persistenceEntity.debitAccountName = domainEntity.debitAccountName;

    persistenceEntity.creditAmount = domainEntity.creditAmount;

    persistenceEntity.debitAmount = domainEntity.debitAmount;

    persistenceEntity.owner = domainEntity.owner;

    if (domainEntity.creditAccount) {
      persistenceEntity.creditAccount = domainEntity.creditAccount.map((item) =>
        AccountMapper.toPersistence(item),
      );
    }

    if (domainEntity.debitAccount) {
      persistenceEntity.debitAccount = domainEntity.debitAccount.map((item) =>
        AccountMapper.toPersistence(item),
      );
    }

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.description = domainEntity.description;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
