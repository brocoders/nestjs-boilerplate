import { IsOptional } from 'class-validator';
import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  OnboardingStepStatus,
  OnboardingEntityType,
} from '../infrastructure/persistence/relational/entities/onboarding.entity';

export class Onboarding {
  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
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
    type: () => Boolean,
    nullable: false,
  })
  isSkippable: boolean;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isRequired: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  order: number;

  @ApiProperty({
    enum: OnboardingStepStatus,
    description: 'Current status of the onboarding step',
    example: OnboardingStepStatus.PENDING,
  })
  status: OnboardingStepStatus;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  description: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  stepKey: string;

  @ApiProperty({
    enum: OnboardingEntityType,
    description: 'Type of entity being onboarded (user or tenant)',
    example: OnboardingEntityType.USER,
  })
  entityType: OnboardingEntityType;

  @ApiProperty({
    type: () => Tenant,
    nullable: true,
  })
  tenant?: Tenant | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  user?: User | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
