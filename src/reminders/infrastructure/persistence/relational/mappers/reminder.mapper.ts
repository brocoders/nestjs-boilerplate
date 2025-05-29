import { Reminder } from '../../../../domain/reminder';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { InvoiceMapper } from '../../../../../invoices/infrastructure/persistence/relational/mappers/invoice.mapper';

import { ReminderEntity } from '../entities/reminder.entity';

export class ReminderMapper {
  static toDomain(raw: ReminderEntity): Reminder {
    const domainEntity = new Reminder();
    domainEntity.message = raw.message;

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.user) {
      domainEntity.user = UserMapper.toDomain(raw.user);
    } else if (raw.user === null) {
      domainEntity.user = null;
    }

    if (raw.invoice) {
      domainEntity.invoice = InvoiceMapper.toDomain(raw.invoice);
    } else if (raw.invoice === null) {
      domainEntity.invoice = null;
    }

    domainEntity.channel = raw.channel;

    domainEntity.status = raw.status;

    domainEntity.scheduledAt = raw.scheduledAt;

    domainEntity.sentAt = raw.sentAt;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Reminder): ReminderEntity {
    const persistenceEntity = new ReminderEntity();
    persistenceEntity.message = domainEntity.message;

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.user) {
      persistenceEntity.user = UserMapper.toPersistence(domainEntity.user);
    } else if (domainEntity.user === null) {
      persistenceEntity.user = null;
    }

    if (domainEntity.invoice) {
      persistenceEntity.invoice = InvoiceMapper.toPersistence(
        domainEntity.invoice,
      );
    } else if (domainEntity.invoice === null) {
      persistenceEntity.invoice = null;
    }

    persistenceEntity.channel = domainEntity.channel;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.scheduledAt = domainEntity.scheduledAt;

    persistenceEntity.sentAt = domainEntity.sentAt;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
