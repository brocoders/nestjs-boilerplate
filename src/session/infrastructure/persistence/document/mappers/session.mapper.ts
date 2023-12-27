import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../entities/session.schema';
import { UserMapper } from 'src/users/infrastructure/persistence/document/mappers/user.mapper';

export class SessionMapper {
  static toDomain(raw: SessionSchemaClass): Session {
    const session = new Session();
    session.id = raw._id.toString();

    if (raw.user) {
      session.user = UserMapper.toDomain(raw.user);
    }

    session.createdAt = raw.createdAt;
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
    sessionEntity.createdAt = session.createdAt;
    sessionEntity.deletedAt = session.deletedAt;
    return sessionEntity;
  }
}
