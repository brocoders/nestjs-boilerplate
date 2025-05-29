import { TenantDto } from '../../tenants/dto/tenant.dto';

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
  IsArray,
  IsEnum,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import {
  Breakdown,
  InvoiceStatus,
} from '../infrastructure/persistence/relational/entities/invoice.entity';

export class CreateInvoiceDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  invoiceNumber: string;

  @ApiProperty({
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

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
    description: 'Payment breakdown structure',
    type: Object,
    example: {
      baseAmount: { type: 'number', example: 100.0 },
      discounts: { type: 'number', example: 10.0 },
      tax: { type: 'number', example: 18.0 },
      adjustments: { type: 'number', example: 5.0 },
    },
    required: false,
    nullable: true,
  })
  breakdown?: Breakdown | null;

  @ApiProperty({
    enum: InvoiceStatus,
    required: true,
  })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

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
