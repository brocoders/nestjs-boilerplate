import { Message } from '../../../../domain/message';

import { MessageEntity } from '../entities/message.entity';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const domainEntity = new Message();
    domainEntity.physicalDeviceId = raw.physicalDeviceId;

    domainEntity.lastSeen = raw.lastSeen;

    domainEntity.message = raw.message;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageEntity {
    const persistenceEntity = new MessageEntity();
    persistenceEntity.physicalDeviceId = domainEntity.physicalDeviceId;

    persistenceEntity.lastSeen = domainEntity.lastSeen;

    persistenceEntity.message = domainEntity.message;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
