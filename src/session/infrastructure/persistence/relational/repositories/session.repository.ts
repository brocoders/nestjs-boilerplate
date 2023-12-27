import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { User } from 'src/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { SessionMapper } from '../mappers/session.mapper';

@Injectable()
export class SessionRelationalRepository implements SessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  async findOne(
    options: EntityCondition<Session>,
  ): Promise<NullableType<Session>> {
    const entity = await this.sessionRepository.findOne({
      where: options as FindOptionsWhere<SessionEntity>,
    });

    return entity ? SessionMapper.toDomain(entity) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    return this.sessionRepository.save(
      this.sessionRepository.create(persistenceModel),
    );
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...(criteria as {
        id?: SessionEntity['id'];
        user?: Pick<UserEntity, 'id'>;
      }),
      id: criteria.id
        ? (criteria.id as SessionEntity['id'])
        : excludeId
          ? Not(excludeId as SessionEntity['id'])
          : undefined,
    });
  }
}
