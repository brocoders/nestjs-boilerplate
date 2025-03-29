import { Device } from '../../../../domain/device';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { DeviceEntity } from '../entities/device.entity';

export class DeviceMapper {
  static toDomain(raw: DeviceEntity): Device {
    const domainEntity = new Device();
    domainEntity.isActive = raw.isActive;

    domainEntity.model = raw.model;

    domainEntity.appVersion = raw.appVersion;

    domainEntity.osVersion = raw.osVersion;

    domainEntity.platform = raw.platform;

    domainEntity.deviceToken = raw.deviceToken;

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Device): DeviceEntity {
    const persistenceEntity = new DeviceEntity();
    persistenceEntity.isActive = domainEntity.isActive;

    persistenceEntity.model = domainEntity.model;

    persistenceEntity.appVersion = domainEntity.appVersion;

    persistenceEntity.osVersion = domainEntity.osVersion;

    persistenceEntity.platform = domainEntity.platform;

    persistenceEntity.deviceToken = domainEntity.deviceToken;

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
