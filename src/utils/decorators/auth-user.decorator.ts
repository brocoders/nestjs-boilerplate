import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { TypeMessage } from '../types/message.type';
import AppLogger from '../../common/logger/logger.instance';
import { RequestWithUser } from '../types/object.type';

export const AuthUserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number => {
    const req: RequestWithUser = ctx.switchToHttp().getRequest();
    AppLogger.log(req.user, AuthUserId.name);
    const userId = Number(req.user?.id);
    AppLogger.log(`AuthUserId: ${userId}`, AuthUserId.name);
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException({
        status: 400,
        message: TypeMessage.getMessageByStatus(400),
        errors: {
          userId: 'InvalidUserId',
        },
      });
    }
    return userId;
  },
);
