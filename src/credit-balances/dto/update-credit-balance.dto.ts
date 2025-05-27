// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateCreditBalanceDto } from './create-credit-balance.dto';

export class UpdateCreditBalanceDto extends PartialType(
  CreateCreditBalanceDto,
) {}
