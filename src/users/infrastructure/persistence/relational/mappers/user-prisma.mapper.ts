import {
  User as PrismaUser,
  Role as PrismaRole,
  Status as PrismaStatus,
  File as PrismaFile,
} from '@prisma/client';
import { User } from '../../../../domain/user';
import { FilePrismaMapper } from '../../../../../files/infrastructure/persistence/relational/mappers/file-prisma.mapper';
import { Role } from '../../../../../roles/domain/role';
import { Status } from '../../../../../statuses/domain/status';

type UserWithRelations = PrismaUser & {
  role?: PrismaRole | null;
  status?: PrismaStatus | null;
  photo?: PrismaFile | null;
};

export class UserPrismaMapper {
  static toDomain(raw: UserWithRelations): User {
    const domainEntity = new User();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.password = raw.password ?? undefined;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;

    if (raw.photo) {
      domainEntity.photo = FilePrismaMapper.toDomain(raw.photo);
    }

    if (raw.role) {
      const role = new Role();
      role.id = raw.role.id;
      role.name = raw.role.name ?? undefined;
      domainEntity.role = role;
    }

    if (raw.status) {
      const status = new Status();
      status.id = raw.status.id;
      status.name = raw.status.name ?? undefined;
      domainEntity.status = status;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt as any;

    return domainEntity;
  }

  static toPersistence(domainEntity: User) {
    return {
      id: typeof domainEntity.id === 'number' ? domainEntity.id : undefined,
      email: domainEntity.email,
      password: domainEntity.password,
      provider: domainEntity.provider,
      socialId: domainEntity.socialId,
      firstName: domainEntity.firstName,
      lastName: domainEntity.lastName,
      photoId: domainEntity.photo?.id ?? null,
      roleId: domainEntity.role?.id ? Number(domainEntity.role.id) : null,
      statusId: domainEntity.status?.id ? Number(domainEntity.status.id) : null,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      deletedAt: domainEntity.deletedAt ?? null,
    };
  }
}
