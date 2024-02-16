import { User } from '../../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { FileSchemaClass } from 'src/files/infrastructure/persistence/document/entities/file.schema';
import { Status } from 'src/statuses/domain/status';
import { Role } from 'src/roles/domain/role';
import { FileMapper } from 'src/files/infrastructure/persistence/document/mappers/file.mapper';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const user = new User();
    user.id = raw._id.toString();
    user.email = raw.email;
    user.password = raw.password;
    user.previousPassword = raw.previousPassword;
    user.provider = raw.provider;
    user.socialId = raw.socialId;
    user.firstName = raw.firstName;
    user.lastName = raw.lastName;
    if (raw.photo) {
      user.photo = FileMapper.toDomain(raw.photo);
    } else if (raw.photo === null) {
      user.photo = null;
    }
    user.role = raw.role;
    user.status = raw.status;
    user.createdAt = raw.createdAt;
    user.updatedAt = raw.updatedAt;
    user.deletedAt = raw.deletedAt;
    return user;
  }

  static toPersistence(user: User): UserSchemaClass {
    let role: Role | undefined = undefined;

    if (user.role) {
      role = new Role();
      role.id = user.role.id;
    }

    let photo: FileSchemaClass | undefined = undefined;

    if (user.photo) {
      photo = new FileSchemaClass();
      photo._id = user.photo.id;
      photo.path = user.photo.path;
    }

    let status: Status | undefined = undefined;

    if (user.status) {
      status = new Status();
      status.id = user.status.id;
    }

    const userEntity = new UserSchemaClass();
    if (user.id && typeof user.id === 'string') {
      userEntity._id = user.id;
    }
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.previousPassword = user.previousPassword;
    userEntity.provider = user.provider;
    userEntity.socialId = user.socialId;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.photo = photo;
    userEntity.role = role;
    userEntity.status = status;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    userEntity.deletedAt = user.deletedAt;
    return userEntity;
  }
}
