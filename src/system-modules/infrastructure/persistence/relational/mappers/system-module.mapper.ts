import { SystemModule } from '../../../../domain/system-module';

import { SystemModuleEntity } from '../entities/system-module.entity';

export class SystemModuleMapper {
  static toDomain(raw: SystemModuleEntity): SystemModule {
    const domainEntity = new SystemModule();
    domainEntity.submodules = raw.submodules;

    domainEntity.description = raw.description;

    domainEntity.name = raw.name;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: SystemModule): SystemModuleEntity {
    const persistenceEntity = new SystemModuleEntity();
    persistenceEntity.submodules = domainEntity.submodules;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.name = domainEntity.name;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
