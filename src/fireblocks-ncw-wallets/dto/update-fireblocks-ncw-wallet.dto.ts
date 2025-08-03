// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateFireblocksNcwWalletDto } from './create-fireblocks-ncw-wallet.dto';

export class UpdateFireblocksNcwWalletDto extends PartialType(
  CreateFireblocksNcwWalletDto,
) {}
