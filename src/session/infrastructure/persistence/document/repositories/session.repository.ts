import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../entities/session.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SessionMapper } from '../mappers/session.mapper';
import { User } from '../../../../../users/domain/user';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import domainToDocumentCondition from '../../../../../utils/domain-to-document-condition';

@Injectable()
export class SessionDocumentRepository implements SessionRepository {
  constructor(
    @InjectModel(SessionSchemaClass.name)
    private sessionModel: Model<SessionSchemaClass>,
  ) {}

  async findOne(
    fields: EntityCondition<Session>,
  ): Promise<NullableType<Session>> {
    const sessionObject = await this.sessionModel.findOne(
      domainToDocumentCondition(fields),
    );
    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async create(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    const createdSession = new this.sessionModel(persistenceModel);
    const sessionObject = await createdSession.save();
    return SessionMapper.toDomain(sessionObject);
  }

  async update(
    id: Session['id'],
    payload: Partial<Session>,
  ): Promise<Session | null> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;
    delete clonedPayload.createdAt;
    delete clonedPayload.updatedAt;
    delete clonedPayload.deletedAt;

    const filter = { _id: id.toString() };
    const session = await this.sessionModel.findOne(filter);

    if (!session) {
      return null;
    }

    const sessionObject = await this.sessionModel.findOneAndUpdate(
      filter,
      SessionMapper.toPersistence({
        ...SessionMapper.toDomain(session),
        ...clonedPayload,
      }),
    );

    return sessionObject ? SessionMapper.toDomain(sessionObject) : null;
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    const transformedCriteria = {
      user: criteria.user?.id,
      _id: criteria.id
        ? criteria.id.toString()
        : excludeId
          ? { $not: { $eq: excludeId.toString() } }
          : undefined,
    };
    await this.sessionModel.deleteMany(transformedCriteria);
  }
}
