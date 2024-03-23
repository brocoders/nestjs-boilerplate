import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../entities/session.schema';

export class SessionMapper {
  static toDomain(raw: SessionSchemaClass): Session {
    const session = new Session();
    session.id = raw._id.toString();

    if (raw.user) {
      session.user = UserMapper.toDomain(raw.user);
    }

    session.hash = raw.hash;
    session.createdAt = raw.createdAt;
    session.updatedAt = raw.updatedAt;
    session.deletedAt = raw.deletedAt;
    return session;
  }
  static toPersistence(session: Session): SessionSchemaClass {
    const user = new UserSchemaClass();
    user._id = session.user.id.toString();
    const sessionEntity = new SessionSchemaClass();
    if (session.id && typeof session.id === 'string') {
      sessionEntity._id = session.id;
    }
    sessionEntity.user = user;
    sessionEntity.hash = session.hash;
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.updatedAt = session.updatedAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
