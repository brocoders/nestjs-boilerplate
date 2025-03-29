import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Device } from '../domain/device';
import { getEnumErrorMessage } from '../../utils/helpers/enum.helper';
import { OrderType, PlatformType } from '../types/devices-enum.type';

export class FilterDeviceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
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

  //TODO: set format validator for string of app version
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  appVersion?: string;
}

export class SortDeviceDto {
  @ApiPropertyOptional({
    description:
      'The field to sort by. Example: "platform", "appVersion", etc.',
    enum: Object.keys(new Device()),
  })
  @IsOptional()
  @IsString()
  orderBy: keyof Device;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: OrderType,
    example: OrderType.ASC,
  })
  @IsOptional()
  @IsEnum(OrderType, {
    message: 'order must be either ASC or DESC',
  })
  order: string;
}

export class QueryDeviceDto {
  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON string for filter options. Example: {"isActive": true, "platform": "iOS", "appVersion": "1.0.0"}',
    example: '{"isActive": true, "platform": "iOS", "appVersion": "v1.0.0"}',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested()
  @Type(() => FilterDeviceDto)
  filters?: FilterDeviceDto;

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON string array for sort options. Example: [{"orderBy": "platform", "order": "ASC"}]',
    example: '[{"orderBy": "platform", "order": "ASC"}]',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested({ each: true })
  @Type(() => SortDeviceDto)
  sort?: SortDeviceDto[];
}
