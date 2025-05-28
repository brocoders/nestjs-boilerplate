import { CreditBalance } from '../../../../domain/credit-balance';
import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { CreditBalanceEntity } from '../entities/credit-balance.entity';

export class CreditBalanceMapper {
  static toDomain(raw: CreditBalanceEntity): CreditBalance {
    const domainEntity = new CreditBalance();
    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.auditLog = raw.auditLog;

    domainEntity.amount = raw.amount;

    if (raw.customer) {
      domainEntity.customer = UserMapper.toDomain(raw.customer);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: CreditBalance): CreditBalanceEntity {
    const persistenceEntity = new CreditBalanceEntity();
    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    persistenceEntity.auditLog = domainEntity.auditLog ?? null;

    persistenceEntity.amount = domainEntity.amount;

    if (domainEntity.customer) {
      persistenceEntity.customer = UserMapper.toPersistence(
        domainEntity.customer,
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
