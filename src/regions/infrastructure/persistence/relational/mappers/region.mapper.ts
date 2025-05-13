import { Region } from '../../../../domain/region';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { RegionEntity } from '../entities/region.entity';

export class RegionMapper {
  static toDomain(raw: RegionEntity): Region {
    const domainEntity = new Region();
    domainEntity.zipCodes = raw.zipCodes;

    domainEntity.operatingHours = raw.operatingHours;

    domainEntity.serviceTypes = raw.serviceTypes;

    domainEntity.centroidLon = raw.centroidLon;

    domainEntity.centroidLat = raw.centroidLat;

    domainEntity.boundary = raw.boundary;

    domainEntity.name = raw.name;

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Region): RegionEntity {
    const persistenceEntity = new RegionEntity();
    persistenceEntity.zipCodes = domainEntity.zipCodes;

    persistenceEntity.operatingHours = domainEntity.operatingHours;

    persistenceEntity.serviceTypes = domainEntity.serviceTypes;

    persistenceEntity.centroidLon = domainEntity.centroidLon || 0.0;

    persistenceEntity.centroidLat = domainEntity.centroidLat || 0.0;

    persistenceEntity.boundary = domainEntity.boundary;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
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
