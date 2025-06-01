import { TenantDto } from '../../tenants/dto/tenant.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Transform,
  Type,
} from 'class-transformer';

import {
  // decorators here
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsDate,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import {
  OnboardingStepStatus,
  OnboardingEntityType,
} from '../infrastructure/persistence/relational/entities/onboarding.entity';

export class CreateOnboardingDto {
  @ApiProperty({
    required: false,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  performedByTenant?: TenantDto;

  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  performedByUser?: UserDto;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  completedAt?: Date | null;

  @ApiProperty({
    type: Object,
    nullable: true,
    description: 'Additional metadata related to the step',
    example: { verificationMethod: 'email', attempts: 3 },
  })
  @IsOptional()
  metadata: Record<string, any> | null;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  isSkippable: boolean;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  isRequired: boolean;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  order: number;

  @ApiProperty({
    enum: OnboardingStepStatus,
    description: 'Current status of the onboarding step',
    example: OnboardingStepStatus.PENDING,
  })
  status: OnboardingStepStatus;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  stepKey: string;

  @ApiProperty({
    enum: OnboardingEntityType,
    description: 'Type of entity being onboarded (user or tenant)',
    example: OnboardingEntityType.USER,
  })
  entityType: OnboardingEntityType;
  tenant: any;
  user: any;

  // @ApiProperty({
  //   required: false,
  //   type: () => TenantDto,
  // })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => TenantDto)
  // @IsNotEmptyObject()
  // tenant?: TenantDto | null;

  // @ApiProperty({
  //   required: false,
  //   type: () => UserDto,
  // })
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => UserDto)
  // @IsNotEmptyObject()
  // user?: UserDto | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
