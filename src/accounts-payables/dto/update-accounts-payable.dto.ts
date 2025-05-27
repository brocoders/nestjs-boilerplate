// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAccountsPayableDto } from './create-accounts-payable.dto';

export class UpdateAccountsPayableDto extends PartialType(
  CreateAccountsPayableDto,
) {}
