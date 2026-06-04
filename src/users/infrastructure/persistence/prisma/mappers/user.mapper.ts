import type { File as PrismaFile, User as PrismaUser } from '@prisma/client';

import { FilePrismaMapper } from '../../../../../files/infrastructure/persistence/prisma/mappers/file.mapper';
import { User } from '../../../../domain/user';

export type PrismaUserWithRelations = PrismaUser & {
  photo: PrismaFile | null;
};

export class UserPrismaMapper {
  static toDomain(raw: PrismaUserWithRelations): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.emailVerified = raw.emailVerified;
    domainEntity.password = raw.password ?? undefined;
    domainEntity.provider = raw.provider;
    domainEntity.role = raw.role;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.photo = raw.photo
      ? FilePrismaMapper.toDomain(raw.photo)
      : null;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt as Date;

    return domainEntity;
  }
}
