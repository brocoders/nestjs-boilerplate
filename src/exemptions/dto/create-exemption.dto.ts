import { TenantDto } from '../../tenants/dto/tenant.dto';

import { InvoiceDto } from '../../invoices/dto/invoice.dto';

import { ResidenceDto } from '../../residences/dto/residence.dto';

import { RegionDto } from '../../regions/dto/region.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsDate,
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

export class CreateExemptionDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

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
    type: () => ResidenceDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ResidenceDto)
  @IsNotEmptyObject()
  residence?: ResidenceDto | null;

  @ApiProperty({
    required: false,
    type: () => RegionDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegionDto)
  @IsNotEmptyObject()
  region?: RegionDto | null;

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
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  reason?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
