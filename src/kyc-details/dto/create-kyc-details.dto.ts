import { TenantDto } from '../../tenants/dto/tenant.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
  Transform,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import {
  KycStatus,
  KycSubjectType,
} from '../infrastructure/persistence/relational/entities/kyc-details.entity';
export class CreateKycDetailsDto {
  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  verifiedBy?: number | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  verifiedAt?: Date | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : value))
  @IsDate()
  submittedAt?: Date | null;

  @ApiProperty({
    required: false,
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  @IsOptional()
  @IsString()
  status?: KycStatus;

  @ApiProperty({
    required: false,
    type: () => Object,
  })
  @IsOptional()
  documentData?: {
    frontUrl?: string;
    backUrl?: string;
    expiryDate?: Date;
  };

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  documentNumber?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  documentType?: string | null;

  @ApiProperty({
    required: true,
    enum: KycSubjectType,
  })
  @IsString()
  subjectType: KycSubjectType;

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
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}
