import { IsOptional, IsEnum } from 'class-validator';
import { Tenant } from '../../tenants/domain/tenant';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  AccountTypeEnum,
  NotificationChannelEnum,
  NotificationTypeEnum,
} from '../../utils/enum/account-type.enum';

export class Account {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  owner?: User[] | null;

  @ApiProperty({
    required: true,
    enum: AccountTypeEnum,
    enumName: 'AccountType',
  })
  @IsEnum(AccountTypeEnum)
  type: AccountTypeEnum;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  active: boolean;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  callbackUrl?: string | null;

  @ApiProperty({
    required: false,
    enum: NotificationChannelEnum,
    enumName: 'NotificationChannel',
  })
  @IsOptional()
  @IsEnum(NotificationChannelEnum)
  notificationChannel?: NotificationChannelEnum | null;

  @ApiProperty({
    required: false,
    enum: NotificationTypeEnum,
    enumName: 'NotificationType',
  })
  @IsOptional()
  @IsEnum(NotificationTypeEnum)
  notificationType?: NotificationTypeEnum | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  receiveNotification: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  balance: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  number?: string | null;

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
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
