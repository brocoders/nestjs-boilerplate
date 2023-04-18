import { User } from '../../../users/entities/user.entity';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  iat: number;
  exp: number;
};
