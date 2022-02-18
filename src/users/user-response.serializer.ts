import { User } from '../users/entities/user.entity';

const userResponseSerializer = (user: User) => {
  delete user.password;
  delete user.hash;
  delete user.previousPassword;
};

export default userResponseSerializer;
