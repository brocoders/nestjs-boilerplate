import { File as PrismaFile } from '@prisma/client';
import { FileType } from '../../../../domain/file';

export class FilePrismaMapper {
  static toDomain(raw: PrismaFile): FileType {
    const domainEntity = new FileType();
    domainEntity.id = raw.id;
    domainEntity.path = raw.path;
    return domainEntity;
  }

  static toPersistence(domainEntity: FileType) {
    return {
      id: domainEntity.id,
      path: domainEntity.path,
    };
  }
}
