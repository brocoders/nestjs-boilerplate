import { AddressBook } from '../../../../domain/address-book';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AddressBookEntity } from '../entities/address-book.entity';

export class AddressBookMapper {
  static toDomain(raw: AddressBookEntity): AddressBook {
    const domainEntity = new AddressBook();
    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.isFavorite = raw.isFavorite;

    domainEntity.notes = raw.notes;

    domainEntity.memo = raw.memo;

    domainEntity.tag = raw.tag;

    domainEntity.assetType = raw.assetType;

    domainEntity.blockchain = raw.blockchain;

    domainEntity.address = raw.address;

    domainEntity.label = raw.label;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AddressBook): AddressBookEntity {
    const persistenceEntity = new AddressBookEntity();
    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    }

    persistenceEntity.isFavorite = domainEntity.isFavorite;

    persistenceEntity.notes = domainEntity.notes;

    persistenceEntity.memo = domainEntity.memo;

    persistenceEntity.tag = domainEntity.tag;

    persistenceEntity.assetType = domainEntity.assetType;

    persistenceEntity.blockchain = domainEntity.blockchain;

    persistenceEntity.address = domainEntity.address;

    persistenceEntity.label = domainEntity.label;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
