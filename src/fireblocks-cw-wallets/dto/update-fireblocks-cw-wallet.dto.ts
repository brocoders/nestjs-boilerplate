// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';
import { CreateFireblocksCwWalletDto } from './create-fireblocks-cw-wallet.dto';

export class UpdateFireblocksCwWalletDto extends PartialType(
  CreateFireblocksCwWalletDto,
) {}
