import { Device } from '../../../../domain/device';
import { DeviceEntity } from '../entities/device.entity';

export class DeviceMapper {
  static toDomain(raw: DeviceEntity): Device {
    const domainEntity = new Device();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Device): DeviceEntity {
    const persistenceEntity = new DeviceEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
