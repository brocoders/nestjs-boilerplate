// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateCustomerPlanDto } from './create-customer-plan.dto';

export class UpdateCustomerPlanDto extends PartialType(CreateCustomerPlanDto) {}
