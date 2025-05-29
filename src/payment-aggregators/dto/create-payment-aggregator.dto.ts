import { TenantDto } from '../../tenants/dto/tenant.dto';

import { PaymentNotificationDto } from '../../payment-notifications/dto/payment-notification.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  IsArray,
  ValidateNested,
  IsOptional,
  IsString,
  IsNotEmptyObject,
  IsBoolean,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { PaymentConfig } from '../infrastructure/persistence/relational/entities/payment-aggregator.entity';

export class CreatePaymentAggregatorDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  logo?: string | null;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  isActive: boolean;

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
    type: Object,
    description: 'Payment configuration object',
    example: {
      webhookUrl: 'https://api.example.com/webhook',
      authToken: 'secure_token_123',
      reconciliationWindow: 30,
    },
  })
  config?: PaymentConfig | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({
    required: false,
    type: () => [PaymentNotificationDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentNotificationDto)
  @IsArray()
  notifications?: PaymentNotificationDto[] | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
