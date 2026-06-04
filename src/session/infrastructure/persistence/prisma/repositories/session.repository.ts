import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../database/prisma.service';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { User } from '../../../../../users/domain/user';
import { Session } from '../../../../domain/session';
import { SessionRepository } from '../../session.repository';
import { SessionPrismaMapper } from '../mappers/session.mapper';

const includeSessionUser = {
  user: {
    include: {
      photo: true,
      role: true,
      status: true,
    },
  },
} satisfies Prisma.SessionInclude;

@Injectable()
export class SessionPrismaRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.prisma.session.findFirst({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      include: includeSessionUser,
    });

    return entity ? SessionPrismaMapper.toDomain(entity) : null;
  }

  async create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session> {
    const entity = await this.prisma.session.create({
      data: this.toCreateData(data),
      include: includeSessionUser,
    });

    return SessionPrismaMapper.toDomain(entity);
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
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const updatedEntity = await this.prisma.session.update({
      where: {
        id: entity.id,
      },
      data: this.toUpdateData(payload),
      include: includeSessionUser,
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
    });

    if (!entity) {
      return null;
    }

    const updatedEntity = await this.prisma.session.update({
      where: {
        id: entity.id,
      },
      data: this.toUpdateData(payload),
      include: includeSessionUser,
    });

    return SessionPrismaMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId: Number(conditions.userId),
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    await this.prisma.session.updateMany({
      where: {
        userId: Number(conditions.userId),
        id: {
          not: Number(conditions.excludeSessionId),
        },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private toCreateData(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Prisma.SessionCreateInput {
    return {
      hash: data.hash,
      user: {
        connect: {
          id: Number(data.user.id),
        },
      },
    };
  }

  private toUpdateData(
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Prisma.SessionUpdateInput {
    const data: Prisma.SessionUpdateInput = {};

    if (payload.hash !== undefined) {
      data.hash = payload.hash;
    }

    if (payload.user !== undefined) {
      data.user = {
        connect: {
          id: Number(payload.user.id),
        },
      };
    }

    return data;
  }
}
