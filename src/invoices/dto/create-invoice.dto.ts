import { ExemptionDto } from '../../exemptions/dto/exemption.dto';

import { DiscountDto } from '../../discounts/dto/discount.dto';

import { AccountsReceivableDto } from '../../accounts-receivables/dto/accounts-receivable.dto';

import { PaymentPlanDto } from '../../payment-plans/dto/payment-plan.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
  Transform,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
  IsArray,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    required: false,
    type: () => ExemptionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ExemptionDto)
  @IsNotEmptyObject()
  exemption?: ExemptionDto | null;

  @ApiProperty({
    required: false,
    type: () => DiscountDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountDto)
  @IsNotEmptyObject()
  discount?: DiscountDto | null;

  @ApiProperty({
    required: false,
    type: () => AccountsReceivableDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AccountsReceivableDto)
  @IsNotEmptyObject()
  accountsReceivable?: AccountsReceivableDto | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  amountDue?: number | null;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  amountPaid?: number | null;

  @ApiProperty({
    required: false,
    type: () => [PaymentPlanDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentPlanDto)
  @IsArray()
  plan?: PaymentPlanDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  breakdown?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dueDate?: Date | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  customer?: UserDto | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
