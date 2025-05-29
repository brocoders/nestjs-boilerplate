import { TenantDto } from '../../tenants/dto/tenant.dto';

import { InvoiceDto } from '../../invoices/dto/invoice.dto';

import { PaymentNotificationDto } from '../../payment-notifications/dto/payment-notification.dto';

import { PaymentMethodDto } from '../../payment-methods/dto/payment-method.dto';

import { UserDto } from '../../users/dto/user.dto';

import { TransactionDto } from '../../transactions/dto/transaction.dto';

import {
  // decorators here

  IsNumber,
  IsDate,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
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
import { PaymentStatus } from '../../utils/enum/payment-notification.enums';

export class CreatePaymentDto {
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
    type: () => InvoiceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDto)
  @IsNotEmptyObject()
  invoice?: InvoiceDto | null;

  @ApiProperty({
    required: false,
    type: () => PaymentNotificationDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentNotificationDto)
  @IsNotEmptyObject()
  notification?: PaymentNotificationDto | null;

  @ApiProperty({
    required: false,
    type: () => PaymentMethodDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentMethodDto)
  @IsNotEmptyObject()
  paymentMethod?: PaymentMethodDto | null;

  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  customer?: UserDto | null;

  @ApiProperty({
    required: false,
    type: () => [TransactionDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TransactionDto)
  @IsArray()
  transactionId?: TransactionDto[] | null;

  @ApiProperty({
    enum: PaymentStatus,
    nullable: false,
  })
  status: PaymentStatus;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  method: string;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  paymentDate: Date;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  amount: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
