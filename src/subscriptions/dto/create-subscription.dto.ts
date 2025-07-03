import { TenantDto } from '../../tenants/dto/tenant.dto';

import { PaymentPlanDto } from '../../payment-plans/dto/payment-plan.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here
  Type,
  Transform,
} from 'class-transformer';

import {
  // decorators here

  IsArray,
  ValidateNested,
  IsDate,
  IsOptional,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { CustomScheduleDto } from '../../common/dto/custom-schedule.dto';
import { PlanStatusEnum } from '../../utils/enum/plan-type.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

  @ApiProperty({
    type: CustomScheduleDto,
    required: false,
    nullable: true,
  })
  customSchedule?: CustomScheduleDto | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  nextPaymentDate?: Date | null;

  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  assignedBy?: UserDto | null;

  @ApiProperty({
    enum: PlanStatusEnum,
    enumName: 'PlanStatusEnum',
    nullable: false,
  })
  status: PlanStatusEnum;

  @ApiProperty({
    type: 'object',
    nullable: true,
    description: 'Custom rates map (key-value pairs)',
    example: { rateA: 100, rateB: 150 },
    additionalProperties: { type: 'number' },
  })
  customRates?: Record<string, number> | null;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate?: Date | null;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;
  @ApiProperty({
    required: true,
    type: () => [PaymentPlanDto],
  })
  @ValidateNested()
  @Type(() => PaymentPlanDto)
  @IsArray()
  plan: PaymentPlanDto[];

  @ApiProperty({
    required: true,
    type: () => [UserDto],
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  customer: UserDto[];

  // Don't forget to use the class-validator decorators in the DTO properties.
}
