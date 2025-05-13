import { TenantType } from '../../../../domain/tenant-type';
import {
  TenantTypeEntity,
  TenantTypeCode,
} from '../entities/tenant-type.entity';

export class TenantTypeMapper {
  static toDomain(raw: TenantTypeEntity): TenantType {
    const domainEntity = new TenantType();
    domainEntity.description = raw.description;

    // Ensure the code is assigned as TenantTypeCode
    domainEntity.code = raw.code as TenantTypeCode;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: TenantType): TenantTypeEntity {
    const persistenceEntity = new TenantTypeEntity();
    persistenceEntity.description = domainEntity.description;

    // Ensure the code is assigned as TenantTypeCode
    persistenceEntity.code = domainEntity.code as TenantTypeCode;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
