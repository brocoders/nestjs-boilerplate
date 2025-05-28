import { RegionDto } from '../../regions/dto/region.dto';

import { UserDto } from '../../users/dto/user.dto';

import { PaymentPlanDto } from '../../payment-plans/dto/payment-plan.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsDate,
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

  Transform,
  Type,
} from 'class-transformer';

export class CreateDiscountDto {
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
    required: false,
    type: () => PaymentPlanDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentPlanDto)
  @IsNotEmptyObject()
  plan?: PaymentPlanDto | null;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  validTo: Date;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  validFrom: Date;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  type?: string | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
