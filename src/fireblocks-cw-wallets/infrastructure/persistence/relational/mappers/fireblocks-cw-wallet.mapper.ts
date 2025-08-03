import { FireblocksCwWallet } from '../../../../domain/fireblocks-cw-wallet';

import { FireblocksCwWalletEntity } from '../entities/fireblocks-cw-wallet.entity';

export class FireblocksCwWalletMapper {
  static toDomain(raw: FireblocksCwWalletEntity): FireblocksCwWallet {
    const domainEntity = new FireblocksCwWallet();
    domainEntity.assets = raw.assets;

    domainEntity.metadata = raw.metadata;

    domainEntity.vaultType = raw.vaultType;

    domainEntity.autoFuel = raw.autoFuel;

    domainEntity.hiddenOnUI = raw.hiddenOnUI;

    domainEntity.name = raw.name;

    domainEntity.referenceId = raw.referenceId;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: FireblocksCwWallet,
  ): FireblocksCwWalletEntity {
    const persistenceEntity = new FireblocksCwWalletEntity();
    persistenceEntity.assets = domainEntity.assets;

    persistenceEntity.metadata = domainEntity.metadata;

    persistenceEntity.vaultType = domainEntity.vaultType;

    persistenceEntity.autoFuel = domainEntity.autoFuel;

    persistenceEntity.hiddenOnUI = domainEntity.hiddenOnUI;

    persistenceEntity.name = domainEntity.name;

    persistenceEntity.referenceId = domainEntity.referenceId;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
