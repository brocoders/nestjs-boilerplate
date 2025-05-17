import { Account } from '../../../../domain/account';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AccountEntity } from '../entities/account.entity';

export class AccountMapper {
  static toDomain(raw: AccountEntity): Account {
    const domainEntity = new Account();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.owner) {
      domainEntity.owner = raw.owner.map((item) => UserMapper.toDomain(item));
    } else if (raw.owner === null) {
      domainEntity.owner = null;
    }

    domainEntity.type = raw.type;

    domainEntity.active = raw.active;

    domainEntity.callbackUrl = raw.callbackUrl;

    domainEntity.notificationChannel = raw.notificationChannel;

    domainEntity.notificationType = raw.notificationType;

    domainEntity.receiveNotification = raw.receiveNotification;

    domainEntity.balance = raw.balance;

    domainEntity.number = raw.number;

    domainEntity.description = raw.description;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Account): AccountEntity {
    const persistenceEntity = new AccountEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.owner) {
      persistenceEntity.owner = domainEntity.owner.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.owner === null) {
      persistenceEntity.owner = null;
    }

    persistenceEntity.type = domainEntity.type;

    persistenceEntity.active = domainEntity.active;

    persistenceEntity.callbackUrl = domainEntity.callbackUrl;

    persistenceEntity.notificationChannel = domainEntity.notificationChannel;

    persistenceEntity.notificationType = domainEntity.notificationType;

    persistenceEntity.receiveNotification = domainEntity.receiveNotification;

    persistenceEntity.balance = domainEntity.balance;

    persistenceEntity.number = domainEntity.number;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
