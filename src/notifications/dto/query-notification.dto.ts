

import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Notification } from '../domain/notification';
import { NotificationCategory } from '../types/notification-enum.type';
import { OrderType } from '../../utils/types/order-type';

export class FilterNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isRead?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isDelivered?: boolean;

  @ApiPropertyOptional({ enum: NotificationCategory })
  @IsOptional()
  @IsEnum(NotificationCategory)
  category?: NotificationCategory;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  topic?: string;
}

export class SortNotificationDto {
  @ApiPropertyOptional({
    description: 'The field to sort by.',
    enum: Object.keys(new Notification()),
  })
  @IsOptional()
  @IsString()
  orderBy: keyof Notification;

  @ApiPropertyOptional({
    description: 'Sort direction',
    enum: OrderType,
  })
  @IsOptional()
  @IsEnum(OrderType)
  order: string;
}

export class QueryNotificationDto {
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
      'JSON string for filter options. Example: {"isRead": true, "category": "general"}',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested()
  @Type(() => FilterNotificationDto)
  filters?: FilterNotificationDto;

  @ApiPropertyOptional({
    type: String,
    description:
      'JSON string array for sort options. Example: [{"orderBy": "title", "order": "ASC"}]',
  })
  @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
  @ValidateNested({ each: true })
  @Type(() => SortNotificationDto)
  sort?: SortNotificationDto[];
}