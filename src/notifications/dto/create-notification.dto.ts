import { NotificationCategory } from '../types/notification-enum.type';
import { IsEnum } from 'class-validator';
import { DeviceDto } from '../../devices/dto/device.dto';
import { ObjectData } from '../../utils/types/object.type';

import { IsObject } from 'class-validator';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({
    enum: NotificationCategory,
    default: NotificationCategory.GENERAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @ApiProperty({
    required: false,
    type: () => Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({
    required: false,
    type: () => Boolean,
  })
  @IsOptional()
  @IsBoolean()
  isDelivered?: boolean;

  @ApiProperty({
    required: true,
    type: () => Object,
    default: false,
  })
  @IsObject()
  data: ObjectData<any>;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  message: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  @ApiProperty({
    required: true,
    type: () => DeviceDto,
  })
  @ValidateNested()
  @Type(() => DeviceDto)
  @IsNotEmptyObject()
  device: DeviceDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
