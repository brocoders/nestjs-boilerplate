import { UserDto } from '../../users/dto/user.dto';

import { RegionDto } from '../../regions/dto/region.dto';

import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here

  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
  IsNotEmptyObject,
  IsArray,
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
import { ResidenceTypeEnum } from '../../utils/enum/residence-type.enum';

export class CreateResidenceDto {
  @ApiProperty({
    enum: ResidenceTypeEnum,
    enumName: 'ResidenceType',
    nullable: false,
  })
  type: ResidenceTypeEnum;
  @ApiProperty({
    required: false,
    type: () => [UserDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  occupants?: UserDto[] | null;

  @ApiProperty({
    required: true,
    type: () => RegionDto,
  })
  @ValidateNested()
  @Type(() => RegionDto)
  @IsNotEmptyObject()
  region: RegionDto;

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
    type: () => Number,
  })
  @IsNumber()
  charge: number;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
