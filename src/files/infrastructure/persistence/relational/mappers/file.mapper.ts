import { FileType } from '../../../../domain/file';
import { FileEntity } from '../entities/file.entity';

export class FileMapper {
  static toDomain(raw: FileEntity): FileType {
    const domainEntity = new FileType();
    // if (raw.tenant) {
    //   domainEntity.tenant = TenantMapper.toDomain(raw.tenant);
    // } else if (raw.tenant === null) {
    //   domainEntity.tenant = null;
    // }
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    return domainEntity;
  }

  static toPersistence(domainEntity: FileType): FileEntity {
    const persistenceEntity = new FileEntity();
    // if (domainEntity.tenant) {
    //   persistenceEntity.tenant = TenantMapper.toPersistence(
    //     domainEntity.tenant,
    //   );
    // } else if (domainEntity.tenant === null) {
    //   persistenceEntity.tenant = null;
    // }

    persistenceEntity.id = domainEntity.id;
    persistenceEntity.path = domainEntity.path;
    return persistenceEntity;
  }
}
