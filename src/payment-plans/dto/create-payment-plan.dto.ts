import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
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

export class CreatePaymentPlanDto {
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
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  rateStructure?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  type?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
