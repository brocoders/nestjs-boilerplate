import type {
  File as PrismaFile,
  Role as PrismaRole,
  Status as PrismaStatus,
  User as PrismaUser,
} from '@prisma/client';

import { FilePrismaMapper } from '../../../../../files/infrastructure/persistence/prisma/mappers/file.mapper';
import { Role } from '../../../../../roles/domain/role';
import { Status } from '../../../../../statuses/domain/status';
import { User } from '../../../../domain/user';

export type PrismaUserWithRelations = PrismaUser & {
  photo: PrismaFile | null;
  role: PrismaRole | null;
  status: PrismaStatus | null;
};

export class UserPrismaMapper {
  static toDomain(raw: PrismaUserWithRelations): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password ?? undefined;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.photo = raw.photo
      ? FilePrismaMapper.toDomain(raw.photo)
      : null;
    domainEntity.role = raw.role ? UserPrismaMapper.toRole(raw.role) : null;
    domainEntity.status = raw.status
      ? UserPrismaMapper.toStatus(raw.status)
      : undefined;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt as Date;

    return domainEntity;
  }

  private static toRole(raw: PrismaRole): Role {
    const role = new Role();
    role.id = raw.id;
    role.name = raw.name;

    return role;
  }

  private static toStatus(raw: PrismaStatus): Status {
    const status = new Status();
    status.id = raw.id;
    status.name = raw.name;

    return status;
  }
}
