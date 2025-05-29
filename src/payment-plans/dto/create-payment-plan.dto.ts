import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here

  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';
import {
  PlanType,
  RateStructure,
} from '../infrastructure/persistence/relational/entities/payment-plan.entity';

export class CreatePaymentPlanDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

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
    type: () => TenantDto,
  })
  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  unit: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  minimumCharge: number;

  @ApiProperty({
    type: Object,
    oneOf: [
      { properties: { type: { enum: ['FLAT'] }, amount: { type: 'number' } } },
      {
        properties: { type: { enum: ['PER_UNIT'] }, rate: { type: 'number' } },
      },
      {
        properties: {
          type: { enum: ['CREDIT_RATE'] },
          rate: { type: 'number' },
        },
      },
      {
        properties: {
          type: { enum: ['TIERED'] },
          tiers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                from: { type: 'number' },
                to: { type: 'number' },
                rate: { type: 'number' },
              },
              required: ['from', 'to', 'rate'],
            },
          },
        },
      },
      {
        properties: {
          type: { enum: ['PREPAID'] },
          creditRate: { type: 'number' },
        },
      },
    ],
    nullable: true,
  })
  rateStructure?: RateStructure | null;

  @ApiProperty({
    enum: PlanType,
    nullable: false,
  })
  type: PlanType;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
