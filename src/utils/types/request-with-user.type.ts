import type { Request } from 'express';

export type RequestWithUser<TUser> = Request & {
  user: TUser;
};
