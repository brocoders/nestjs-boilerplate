import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { PaymentMethodConfig } from '../infrastructure/persistence/relational/entities/payment-method.entity';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreatePaymentMethodDto {
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
    type: () => Object,
    nullable: true,
  })
  @IsOptional()
  config?: PaymentMethodConfig | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  processorType: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
