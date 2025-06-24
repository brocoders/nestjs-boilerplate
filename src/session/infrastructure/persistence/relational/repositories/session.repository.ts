import { Inject, Injectable } from '@nestjs/common';
import { DataSource, FindOptionsWhere, Not, Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';

import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';

import { SessionMapper } from '../mappers/session.mapper';
import { User } from '../../../../../users/domain/user';
import { REQUEST } from '@nestjs/core';
import { TenantDataSource } from '../../../../../database/tenant-data-source';

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
  private sessionRepository: Repository<SessionEntity>;

  constructor(@Inject(REQUEST) private request: Request) {
    const dataSource: DataSource =
      this.request['tenantDataSource'] || TenantDataSource.getCoreDataSource();
    this.sessionRepository = dataSource.getRepository(SessionEntity);
  }

  private applyTenantFilter(
    where: FindOptionsWhere<SessionEntity> = {},
  ): FindOptionsWhere<SessionEntity> {
    const tenantId = this.request['tenantId'];

    if (tenantId) {
      return {
        ...where,
        tenant: { id: tenantId },
      };
    }

    return where;
  }

  async findById(id: Session['id']): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: this.applyTenantFilter({ id: Number(id) }),
    });

    return entity ? SessionMapper.toDomain(entity) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    // return this.sessionRepository.save(
    //   this.sessionRepository.create(persistenceModel),
    // );
    const savedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel),
    );
    return SessionMapper.toDomain(savedEntity);
  }

  async update(
    id: Session['id'],
    payload: Partial<
      Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
    >,
  ): Promise<Session | null> {
    const entity = await this.sessionRepository.findOne({
      where: this.applyTenantFilter({ id: Number(id) }),
    });

    if (!entity) {
      throw new Error('Session not found');
    }

    const updatedEntity = await this.sessionRepository.save(
      this.sessionRepository.create(
        SessionMapper.toPersistence({
          ...SessionMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return SessionMapper.toDomain(updatedEntity);
  }

  async deleteById(id: Session['id']): Promise<void> {
    await this.sessionRepository.softDelete({
      id: Number(id),
    });
  }

  async deleteByUserId(conditions: { userId: User['id'] }): Promise<void> {
    await this.sessionRepository.softDelete({
      user: {
        id: Number(conditions.userId),
      },
    });
  }

  async deleteByUserIdWithExclude(conditions: {
    userId: User['id'];
    excludeSessionId: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      user: {
        id: Number(conditions.userId),
      },
      id: Not(Number(conditions.excludeSessionId)),
    });
  }
}
