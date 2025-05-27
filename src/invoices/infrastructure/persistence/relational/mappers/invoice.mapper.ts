import { Invoice } from '../../../../domain/invoice';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { InvoiceEntity } from '../entities/invoice.entity';

export class InvoiceMapper {
  static toDomain(raw: InvoiceEntity): Invoice {
    const domainEntity = new Invoice();
    domainEntity.breakdown = raw.breakdown;

    domainEntity.status = raw.status;

    domainEntity.dueDate = raw.dueDate;

    domainEntity.amount = raw.amount;

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    } else if (raw.customer === null) {
      domainEntity.customer = null;
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Invoice): InvoiceEntity {
    const persistenceEntity = new InvoiceEntity();
    persistenceEntity.breakdown = domainEntity.breakdown;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.dueDate = domainEntity.dueDate;

    persistenceEntity.amount = domainEntity.amount;

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
      );
    } else if (domainEntity.customer === null) {
      persistenceEntity.customer = null;
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
