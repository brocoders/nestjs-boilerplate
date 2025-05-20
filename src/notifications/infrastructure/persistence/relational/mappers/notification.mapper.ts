import { Notification } from '../../../../domain/notification';

import { DeviceMapper } from '../../../../../devices/infrastructure/persistence/relational/mappers/device.mapper';

import { NotificationEntity } from '../entities/notification.entity';
import { NotificationCategory } from '../../../../types/notification-enum.type';

export class NotificationMapper {
  static toDomain(raw: NotificationEntity): Notification {
    const domainEntity = new Notification();
    domainEntity.category = raw.category ?? NotificationCategory.GENERAL;

    domainEntity.isRead = raw.isRead;

    domainEntity.isDelivered = raw.isDelivered;

    domainEntity.data = raw.data;

    domainEntity.topic = raw.topic;

    domainEntity.message = raw.message;

    domainEntity.title = raw.title;

    if (raw.device) {
      domainEntity.device = DeviceMapper.toDomain(raw.device);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Notification): NotificationEntity {
    const persistenceEntity = new NotificationEntity();
    persistenceEntity.category = domainEntity.category;

    persistenceEntity.isRead = domainEntity.isRead;

    persistenceEntity.isDelivered = domainEntity.isDelivered;

    persistenceEntity.data = domainEntity.data;

    persistenceEntity.topic = domainEntity.topic;

    persistenceEntity.message = domainEntity.message;

    persistenceEntity.title = domainEntity.title;

    if (domainEntity.device) {
      persistenceEntity.device = DeviceMapper.toPersistence(
        domainEntity.device,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
