import { OnboardingDto } from '../../onboardings/dto/onboarding.dto';

import { RegionDto } from '../../regions/dto/region.dto';

import { SettingsDto } from '../../settings/dto/settings.dto';

import { KycDetailsDto } from '../../kyc-details/dto/kyc-details.dto';

import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here
  Transform,
  Type,
} from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  // decorators here
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  ValidateNested,
  IsNotEmptyObject,
  IsArray,
  IsString,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { RoleDto } from '../../roles/dto/role.dto';
import { StatusDto } from '../../statuses/dto/status.dto';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({
    required: false,
    type: () => [OnboardingDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => OnboardingDto)
  @IsArray()
  onboardingSteps?: OnboardingDto[] | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  countryCode?: string | null;

  @ApiProperty({
    required: false,
    type: () => [RegionDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RegionDto)
  @IsArray()
  regions?: RegionDto[] | null;

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
    type: () => [KycDetailsDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => KycDetailsDto)
  @IsArray()
  kycSubmissions?: KycDetailsDto[] | null;

  @ApiProperty({
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

  @ApiProperty({ example: 'test1@example.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John', type: String })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe', type: String })
  @IsNotEmpty()
  lastName: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiPropertyOptional({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;
}
