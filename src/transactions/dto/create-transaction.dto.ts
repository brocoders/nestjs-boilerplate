import { TenantDto } from '../../tenants/dto/tenant.dto';

import { PaymentDto } from '../../payments/dto/payment.dto';

import { AccountDto } from '../../accounts/dto/account.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmptyObject,
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
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

  @ApiProperty({
    required: true,
    type: () => PaymentDto,
  })
  @ValidateNested()
  @Type(() => PaymentDto)
  @IsNotEmptyObject()
  payment: PaymentDto;

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
