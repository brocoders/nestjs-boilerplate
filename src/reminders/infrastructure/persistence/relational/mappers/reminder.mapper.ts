import { Reminder } from '../../../../domain/reminder';
import { ReminderEntity } from '../entities/reminder.entity';

export class ReminderMapper {
  static toDomain(raw: ReminderEntity): Reminder {
    const domainEntity = new Reminder();
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Reminder): ReminderEntity {
    const persistenceEntity = new ReminderEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
