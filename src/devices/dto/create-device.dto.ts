import { UserDto } from '../../users/dto/user.dto';
import { Type } from 'class-transformer';

import {
  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PlatformType } from '../types/devices-enum.type';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';

export class CreateDeviceDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isActive: boolean = false;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  model: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  appVersion: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  osVersion?: string | null;

  @ApiProperty({
    type: String,
    required: true,
    enum: PlatformType,
    description:
      'The platform of the device used for receiving push notifications.',
  })
  @IsEnum(PlatformType, {
    message: getEnumErrorMessage(PlatformType, 'Platform'),
  })
  @IsString()
  platform: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  deviceToken: string;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  user: UserDto;
}
