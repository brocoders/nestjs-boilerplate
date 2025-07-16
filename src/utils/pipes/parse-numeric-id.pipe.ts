import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { TypeMessage } from '../types/message.type';

@Injectable()
export class ParseNumericIdPipe implements PipeTransform {
  transform(value: any): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException('Invalid numeric ID');
    }
    return parsed;
  }
}

export class UserIdNumericPipe extends ParseNumericIdPipe {
  override transform(value: any): number {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException({
        status: 400,
        message: TypeMessage.getMessageByStatus(400),
        errors: {
          userId: 'InvalidUserId',
        },
      });
    }
    return parsed;
  }
}
