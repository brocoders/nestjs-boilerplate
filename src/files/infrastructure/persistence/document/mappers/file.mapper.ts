import { FileType } from '../../../../domain/file';
import { FileSchemaClass } from '../entities/file.schema';

export class FileMapper {
  static toDomain(raw: FileSchemaClass): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw._id.toString();
    domainEntity.path = raw.path;
    return domainEntity;
  }
  static toPersistence(domainEntity: FileType): FileSchemaClass {
    const persistenceSchema = new FileSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.path = domainEntity.path;
    return persistenceSchema;
  }
}
