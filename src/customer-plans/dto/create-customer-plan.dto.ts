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
  IsString,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateCustomerPlanDto {
  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  customSchedule?: string | null;

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
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  customRates?: string | null;

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
