// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateAccountsReceivableDto } from './create-accounts-receivable.dto';

export class UpdateAccountsReceivableDto extends PartialType(
  CreateAccountsReceivableDto,
) {}
