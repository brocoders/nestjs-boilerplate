import { Passphrase } from '../../../../domain/passphrase';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { PassphraseEntity } from '../entities/passphrase.entity';

export class PassphraseMapper {
  static toDomain(raw: PassphraseEntity): Passphrase {
    const domainEntity = new Passphrase();
    domainEntity.location = raw.location;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Passphrase): PassphraseEntity {
    const persistenceEntity = new PassphraseEntity();
    persistenceEntity.location = domainEntity.location;

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
