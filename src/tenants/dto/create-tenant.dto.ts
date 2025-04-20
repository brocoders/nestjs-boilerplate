import { SettingsDto } from '../../settings/dto/settings.dto';

import { FileDto } from '../../files/dto/file.dto';

import { TenantTypeDto } from '../../tenant-types/dto/tenant-type.dto';

import { KycDetailsDto } from '../../kyc-details/dto/kyc-details.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateTenantDto {
  @ApiProperty({
    required: false,
    type: () => [SettingsDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  @IsArray()
  settings?: SettingsDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  schemaName?: string | null;

  @ApiProperty({
    required: false,
    type: () => FileDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => FileDto)
  @IsNotEmptyObject()
  logo?: FileDto | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  primaryPhone?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  primaryEmail?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({
    required: false,
    type: () => TenantTypeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => TenantTypeDto)
  @IsNotEmptyObject()
  type?: TenantTypeDto | null;

  @ApiProperty({
    required: false,
    type: () => [KycDetailsDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => KycDetailsDto)
  @IsArray()
  kycSubmissions?: KycDetailsDto[] | null;

  @ApiProperty({
    required: false,
    type: () => [UserDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  users?: UserDto[] | null;

  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
