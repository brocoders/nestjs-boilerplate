import { JwtPayloadType } from '../../auth/strategies/types/jwt-payload.type';
import { Request } from '@nestjs/common';
export type ObjectData<T = any> = Record<string, T>;
export type JsonObject = ObjectData<any>;
export interface RequestWithUser extends Request {
  user: JwtPayloadType;
}
