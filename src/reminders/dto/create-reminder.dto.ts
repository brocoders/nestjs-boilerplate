import { UserDto } from '../../users/dto/user.dto';

import { InvoiceDto } from '../../invoices/dto/invoice.dto';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';

import {
  // decorators here

  IsOptional,
  IsDate,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateReminderDto {
  @ApiProperty({
    required: false,
    type: () => UserDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user?: UserDto | null;

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
    type: () => String,
  })
  @IsOptional()
  @IsString()
  channel?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  status?: string | null;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  scheduledAt: Date;

  @ApiProperty({
    required: false,
    type: () => Date,
  })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  sentAt?: Date | null;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
