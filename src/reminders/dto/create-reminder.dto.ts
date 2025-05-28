import { TenantDto } from '../../tenants/dto/tenant.dto';

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
  ValidateNested,
  IsNotEmptyObject,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import {
  ReminderChannel,
  ReminderStatus,
} from '../infrastructure/persistence/relational/entities/reminder.entity';

export class CreateReminderDto {
  @ApiProperty({
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

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
    enum: ReminderChannel,
    required: true,
    nullable: false,
  })
  @IsOptional()
  @IsEnum(ReminderChannel)
  channel: ReminderChannel | null;

  @ApiProperty({
    enum: ReminderStatus,
    required: true,
    nullable: false,
  })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status: ReminderStatus | null;

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
