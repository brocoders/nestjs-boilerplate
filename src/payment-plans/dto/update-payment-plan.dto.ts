// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreatePaymentPlanDto } from './create-payment-plan.dto';

export class UpdatePaymentPlanDto extends PartialType(CreatePaymentPlanDto) {}
