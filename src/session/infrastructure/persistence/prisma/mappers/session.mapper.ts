import type { Session as PrismaSession } from '@prisma/client';

import {
  PrismaUserWithRelations,
  UserPrismaMapper,
} from '../../../../../users/infrastructure/persistence/prisma/mappers/user.mapper';
import { Session } from '../../../../domain/session';

export type PrismaSessionWithUser = PrismaSession & {
  user: PrismaUserWithRelations | null;
};

export class SessionPrismaMapper {
  static toDomain(raw: PrismaSessionWithUser): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;

    if (raw.user) {
      domainEntity.user = UserPrismaMapper.toDomain(raw.user);
    }

    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt as Date;

    return domainEntity;
  }
}
