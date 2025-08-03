import { FireblocksNcwWallet } from '../../../../domain/fireblocks-ncw-wallet';
import { FireblocksNcwWalletEntity } from '../entities/fireblocks-ncw-wallet.entity';

export class FireblocksNcwWalletMapper {
  static toDomain(raw: FireblocksNcwWalletEntity): FireblocksNcwWallet {
    const domainEntity = new FireblocksNcwWallet();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(
    domainEntity: FireblocksNcwWallet,
  ): FireblocksNcwWalletEntity {
    const persistenceEntity = new FireblocksNcwWalletEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
