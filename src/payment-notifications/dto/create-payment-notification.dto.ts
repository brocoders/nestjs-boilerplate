import { TenantDto } from '../../tenants/dto/tenant.dto';

import { PaymentAggregatorDto } from '../../payment-aggregators/dto/payment-aggregator.dto';

import {
  // decorators here

  IsString,
  IsNumber,
  IsDate,
  IsBoolean,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';
import {
  PaymentStatus,
  PaymentMethod,
  Currency,
  PaymentProvider,
} from '../../utils/enum/payment-notification.enums';

export class CreatePaymentNotificationDto {
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
    type: () => PaymentAggregatorDto,
  })
  @ValidateNested()
  @Type(() => PaymentAggregatorDto)
  @IsNotEmptyObject()
  aggregator: PaymentAggregatorDto;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  processed_at?: Date | null;

  @ApiProperty({
    required: true,
    type: Boolean,
  })
  @IsBoolean()
  processed: boolean;

  @ApiProperty({
    required: true,
    type: Object,
  })
  raw_payload: object;

  @ApiProperty({
    required: true,
    enum: PaymentStatus,
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    required: true,
    type: Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  received_at: Date;

  @ApiProperty({
    required: true,
    enum: PaymentMethod,
  })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    required: true,
    enum: Currency,
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    required: true,
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  external_txn_id: string;

  @ApiProperty({
    required: true,
    enum: PaymentProvider,
  })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
