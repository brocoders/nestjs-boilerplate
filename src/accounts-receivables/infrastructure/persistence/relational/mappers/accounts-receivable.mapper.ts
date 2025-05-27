import { AccountsReceivable } from '../../../../domain/accounts-receivable';
import { AccountMapper } from '../../../../../accounts/infrastructure/persistence/relational/mappers/account.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccountsReceivableEntity } from '../entities/accounts-receivable.entity';

export class AccountsReceivableMapper {
  static toDomain(raw: AccountsReceivableEntity): AccountsReceivable {
    const domainEntity = new AccountsReceivable();
    if (raw.account) {
      domainEntity.account = raw.account.map((item) =>
        AccountMapper.toDomain(item),
      );
    } else if (raw.account === null) {
      domainEntity.account = null;
    }

    if (raw.owner) {
      domainEntity.owner = raw.owner.map((item) => UserMapper.toDomain(item));
    } else if (raw.owner === null) {
      domainEntity.owner = null;
    }

    domainEntity.accountType = raw.accountType;

    domainEntity.amount = raw.amount;

    domainEntity.transactionType = raw.transactionType;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: AccountsReceivable,
  ): AccountsReceivableEntity {
    const persistenceEntity = new AccountsReceivableEntity();
    if (domainEntity.account) {
      persistenceEntity.account = domainEntity.account.map((item) =>
        AccountMapper.toPersistence(item),
      );
    } else if (domainEntity.account === null) {
      persistenceEntity.account = null;
    }

    if (domainEntity.owner) {
      persistenceEntity.owner = domainEntity.owner.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.owner === null) {
      persistenceEntity.owner = null;
    }

    persistenceEntity.accountType = domainEntity.accountType;

    persistenceEntity.amount = domainEntity.amount;

    persistenceEntity.transactionType = domainEntity.transactionType;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
