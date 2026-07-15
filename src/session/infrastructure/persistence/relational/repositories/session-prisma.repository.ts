import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../database/prisma.service';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { SessionPrismaMapper } from '../mappers/session-prisma.mapper';
import { User } from '../../../../../users/domain/user';

@Injectable()
export class SessionPrismaRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.prisma.session.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    return entity ? SessionPrismaMapper.toDomain(entity) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionPrismaMapper.toPersistence(data);

    const newEntity = await this.prisma.session.create({
      data: persistenceModel,
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    return SessionPrismaMapper.toDomain(newEntity);
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.prisma.session.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const domainEntity = SessionPrismaMapper.toDomain(entity);
    const updatedData = SessionPrismaMapper.toPersistence({
      ...domainEntity,
      ...payload,
    });

    const updatedEntity = await this.prisma.session.update({
      where: { id: Number(id) },
      data: updatedData,
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    return SessionPrismaMapper.toDomain(updatedEntity);
  }

  async updateByHash(
    conditions: { id: Session['id']; hash: Session['hash'] },
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.prisma.session.findFirst({
      where: {
        id: Number(conditions.id),
        hash: conditions.hash,
        deletedAt: null,
      },
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const domainEntity = SessionPrismaMapper.toDomain(entity);
    const updatedData = SessionPrismaMapper.toPersistence({
      ...domainEntity,
      ...payload,
    });

    const updatedEntity = await this.prisma.session.update({
      where: { id: Number(conditions.id) },
      data: updatedData,
      include: {
        user: {
          include: {
            role: true,
            status: true,
            photo: true,
          },
        },
      },
    });

    return SessionPrismaMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.prisma.session.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId: Number(conditions.userId),
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId: Number(conditions.userId),
        id: { not: Number(conditions.excludeSessionId) },
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }
}
