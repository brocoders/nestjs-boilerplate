import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { Invoice } from '../../invoices/domain/invoice';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import {
  ReminderChannel,
  ReminderStatus,
} from '../infrastructure/persistence/relational/entities/reminder.entity';

export class Reminder {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  message?: string | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  user?: User | null;

  @ApiProperty({
    type: () => Invoice,
    nullable: true,
  })
  invoice?: Invoice | null;

  @ApiProperty({
    enum: ReminderChannel,
    required: true,
    nullable: false,
  })
  @IsOptional()
  @IsEnum(ReminderChannel)
  channel: ReminderChannel;

  @ApiProperty({
    enum: ReminderStatus,
    required: true,
    nullable: false,
  })
  @IsOptional()
  @IsEnum(ReminderStatus)
  status: ReminderStatus;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  scheduledAt: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  sentAt?: Date | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
