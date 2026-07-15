import { Session as PrismaSession, User as PrismaUser } from '@prisma/client';
import { Session } from '../../../../domain/session';
import { UserPrismaMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user-prisma.mapper';

type SessionWithRelations = PrismaSession & {
  user:
    | (PrismaUser & {
        role?: any;
        status?: any;
        photo?: any;
      })
    | null;
};

export class SessionPrismaMapper {
  static toDomain(raw: SessionWithRelations): Session {
    const domainEntity = new Session();
    domainEntity.id = raw.id;
    domainEntity.hash = raw.hash;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt as any;
    if (raw.user) {
      domainEntity.user = UserPrismaMapper.toDomain(raw.user);
    }
    return domainEntity;
  }

  static toPersistence(domainEntity: Session) {
    return {
      id: typeof domainEntity.id === 'number' ? domainEntity.id : undefined,
      userId: Number(domainEntity.user.id),
      hash: domainEntity.hash,
      createdAt: domainEntity.createdAt,
      updatedAt: domainEntity.updatedAt,
      deletedAt: domainEntity.deletedAt ?? null,
    };
  }
}
