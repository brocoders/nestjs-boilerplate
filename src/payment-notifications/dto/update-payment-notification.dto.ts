// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePaymentNotificationDto } from './create-payment-notification.dto';

export class UpdatePaymentNotificationDto extends PartialType(
  CreatePaymentNotificationDto,
) {}
