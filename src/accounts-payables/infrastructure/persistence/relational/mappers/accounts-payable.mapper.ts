import { AccountsPayable } from '../../../../domain/accounts-payable';
import { AccountMapper } from '../../../../../accounts/infrastructure/persistence/relational/mappers/account.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccountsPayableEntity } from '../entities/accounts-payable.entity';

export class AccountsPayableMapper {
  static toDomain(raw: AccountsPayableEntity): AccountsPayable {
    const domainEntity = new AccountsPayable();
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

    domainEntity.salePrice = raw.salePrice;

    domainEntity.purchasePrice = raw.purchasePrice;

    domainEntity.quantity = raw.quantity;

    domainEntity.itemDescription = raw.itemDescription;

    domainEntity.itemName = raw.itemName;

    domainEntity.amount = raw.amount;

    domainEntity.transactionType = raw.transactionType;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AccountsPayable): AccountsPayableEntity {
    const persistenceEntity = new AccountsPayableEntity();
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

    persistenceEntity.salePrice = domainEntity.salePrice;

    persistenceEntity.purchasePrice = domainEntity.purchasePrice;

    persistenceEntity.quantity = domainEntity.quantity;

    persistenceEntity.itemDescription = domainEntity.itemDescription;

    persistenceEntity.itemName = domainEntity.itemName;

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
