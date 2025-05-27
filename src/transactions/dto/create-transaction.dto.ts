import { AccountDto } from '../../accounts/dto/account.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  creditAccountName?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  debitAccountName?: string | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  creditAmount: number;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  debitAmount: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  owner?: string | null;

  @ApiProperty({
    required: true,
    type: () => [AccountDto],
  })
  @ValidateNested()
  @Type(() => AccountDto)
  @IsArray()
  creditAccount: AccountDto[];

  @ApiProperty({
    required: true,
    type: () => [AccountDto],
  })
  @ValidateNested()
  @Type(() => AccountDto)
  @IsArray()
  debitAccount: AccountDto[];

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
