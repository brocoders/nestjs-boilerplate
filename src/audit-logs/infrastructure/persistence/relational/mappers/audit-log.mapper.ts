import { AuditLog } from '../../../../domain/audit-log';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { AuditLogEntity } from '../entities/audit-log.entity';

export class AuditLogMapper {
  static toDomain(raw: AuditLogEntity): AuditLog {
    const domainEntity = new AuditLog();
    if (raw.performedByUser) {
      domainEntity.performedByUser = UserMapper.toDomain(raw.performedByUser);
    } else if (raw.performedByUser === null) {
      domainEntity.performedByUser = null;
    }

    if (raw.performedByTenant) {
      domainEntity.performedByTenant = TenantMapper.toDomain(
        raw.performedByTenant,
      );
    } else if (raw.performedByTenant === null) {
      domainEntity.performedByTenant = null;
    }

    domainEntity.status = raw.status;

    domainEntity.description = raw.description;

    domainEntity.afterState = raw.afterState;

    domainEntity.beforeState = raw.beforeState;

    domainEntity.entityId = raw.entityId;

    domainEntity.entityType = raw.entityType;

    domainEntity.action = raw.action;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: AuditLog): AuditLogEntity {
    const persistenceEntity = new AuditLogEntity();
    if (domainEntity.performedByUser) {
      persistenceEntity.performedByUser = UserMapper.toPersistence(
        domainEntity.performedByUser,
      );
    } else if (domainEntity.performedByUser === null) {
      persistenceEntity.performedByUser = null;
    }

    if (domainEntity.performedByTenant) {
      persistenceEntity.performedByTenant = TenantMapper.toPersistence(
        domainEntity.performedByTenant,
      );
    } else if (domainEntity.performedByTenant === null) {
      persistenceEntity.performedByTenant = null;
    }

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.afterState = domainEntity.afterState ?? undefined;

    persistenceEntity.beforeState = domainEntity.beforeState ?? undefined;

    persistenceEntity.entityId = domainEntity.entityId;

    persistenceEntity.entityType = domainEntity.entityType;

    persistenceEntity.action = domainEntity.action;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
