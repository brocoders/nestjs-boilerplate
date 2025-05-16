import { Residence } from '../../../../domain/residence';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { RegionMapper } from '../../../../../regions/infrastructure/persistence/relational/mappers/region.mapper';

import { TenantMapper } from '../../../../../tenants/infrastructure/persistence/relational/mappers/tenant.mapper';

import { ResidenceEntity } from '../entities/residence.entity';

export class ResidenceMapper {
  static toDomain(raw: ResidenceEntity): Residence {
    const domainEntity = new Residence();
    domainEntity.type = raw.type;

    if (raw.occupants) {
      domainEntity.occupants = raw.occupants.map((item) =>
        UserMapper.toDomain(item),
      );
    } else if (raw.occupants === null) {
      domainEntity.occupants = null;
    }

    if (raw.region) {
      domainEntity.region = RegionMapper.toDomain(raw.region);
    }

    if (raw.tenant) {
      domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    }

    domainEntity.isActive = raw.isActive;

    domainEntity.charge = raw.charge;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Residence): ResidenceEntity {
    const persistenceEntity = new ResidenceEntity();
    persistenceEntity.type = domainEntity.type;

    if (domainEntity.occupants) {
      persistenceEntity.occupants = domainEntity.occupants.map((item) =>
        UserMapper.toPersistence(item),
      );
    } else if (domainEntity.occupants === null) {
      persistenceEntity.occupants = null;
    }

    if (domainEntity.region) {
      persistenceEntity.region = RegionMapper.toPersistence(
        domainEntity.region,
      );
    }

    if (domainEntity.tenant) {
      persistenceEntity.tenant = TenantMapper.toPersistence(
        domainEntity.tenant,
      );
    }

    persistenceEntity.isActive = domainEntity.isActive;

    persistenceEntity.charge = domainEntity.charge;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
