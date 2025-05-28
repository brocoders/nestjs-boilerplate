import { AccountDto } from '../../accounts/dto/account.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../utils/enum/account-type.enum';

export class CreateAccountsReceivableDto {
  @ApiProperty({
    required: false,
    type: () => [AccountDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountDto)
  @IsArray()
  account?: AccountDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [UserDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  owner?: UserDto[] | null;

  @ApiPropertyOptional({
    enum: AccountTypeEnum,
    description: 'The type of account. Can be SAVINGS, CHECKING, or CURRENT.',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(AccountTypeEnum)
  accountType?: AccountTypeEnum | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    enum: TransactionTypeEnum,
    required: true,
    description: 'The type of transaction: CREDIT, DEBIT, TRANSFER, or REFUND.',
  })
  @IsEnum(TransactionTypeEnum)
  transactionType: TransactionTypeEnum;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
