import { TenantDto } from '../../tenants/dto/tenant.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNotEmptyObject,
  IsEnum,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';
import {
  AccountTypeEnum,
  NotificationChannelEnum,
  NotificationTypeEnum,
} from '../../utils/enum/account-type.enum';

export class CreateAccountDto {
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
    type: () => [UserDto],
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  @IsArray()
  owner?: UserDto[] | null;

  @ApiProperty({
    required: true,
    enum: AccountTypeEnum,
    enumName: 'AccountType',
  })
  @IsEnum(AccountTypeEnum)
  type: AccountTypeEnum;

  @ApiProperty({
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
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
    required: true,
    type: () => Boolean,
  })
  @IsBoolean()
  receiveNotification: boolean;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  balance: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  number?: string | null;

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

  // Don't forget to use the class-validator decorators in the DTO properties.
}
