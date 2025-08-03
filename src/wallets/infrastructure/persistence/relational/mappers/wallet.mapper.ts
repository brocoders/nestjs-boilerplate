import { Wallet } from '../../../../domain/wallet';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { WalletEntity } from '../entities/wallet.entity';

export class WalletMapper {
  static toDomain(raw: WalletEntity): Wallet {
    const domainEntity = new Wallet();
    domainEntity.active = raw.active;

    domainEntity.label = raw.label;

    domainEntity.provider = raw.provider;

    domainEntity.lockupId = raw.lockupId;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Wallet): WalletEntity {
    const persistenceEntity = new WalletEntity();
    persistenceEntity.active = domainEntity.active;

    persistenceEntity.label = domainEntity.label;

    persistenceEntity.provider = domainEntity.provider;

    persistenceEntity.lockupId = domainEntity.lockupId;

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
