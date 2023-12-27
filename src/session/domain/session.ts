import { User } from 'src/users/domain/user';

export class Session {
  id: number | string;
  user: User;
  createdAt: Date;
  deletedAt: Date;
}
