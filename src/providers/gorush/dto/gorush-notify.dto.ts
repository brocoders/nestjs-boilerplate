import {
  IsArray,
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PushNotificationDto {
  @ApiPropertyOptional({
    description:
      'A unique string that identifies the notification for async feedback',
  })
  @IsString()
  @IsOptional()
  notif_id?: string;

  @ApiProperty({ description: 'Device tokens' })
  @IsArray()
  @IsString({ each: true })
  tokens: string[];

  @ApiProperty({ description: 'Platform (1=iOS, 2=Android, 3=Huawei)' })
  @IsInt()
  platform: number;

  @ApiProperty({ description: 'Message for the notification' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ description: 'Notification title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Sets the priority of the message (normal or high)',
  })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ description: 'Data messages wake the app by default' })
  @IsOptional()
  @IsBoolean()
  content_available?: boolean;

  @ApiPropertyOptional({ description: 'Sound settings for iOS notifications' })
  @IsOptional()
  @IsObject()
  sound?: {
    name?: string;
    volume?: number;
    critical?: number;
  };

  @ApiPropertyOptional({
    description: 'Extensible data partition for Android and iOS',
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Huawei-specific extensible data partition',
  })
  @IsOptional()
  @IsString()
  huawei_data?: string;

  @ApiPropertyOptional({
    description: 'Retry send notification if fail response from server',
  })
  @IsOptional()
  @IsInt()
  retry?: number;

  @ApiPropertyOptional({ description: 'Send messages to topics' })
  @IsOptional()
  @IsString()
  topic?: string;

  @ApiPropertyOptional({ description: 'Image URL to show in notification' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description:
      'The value must be a registration token, notification key, or topic',
  })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ description: 'Key for collapsing notifications' })
  @IsOptional()
  @IsString()
  collapse_key?: string;

  @ApiPropertyOptional({
    description: 'Huawei-specific key for collapsing notifications',
  })
  @IsOptional()
  @IsInt()
  huawei_collapse_key?: number;

  @ApiPropertyOptional({ description: 'Flag for device idling' })
  @IsOptional()
  @IsBoolean()
  delay_while_idle?: boolean;

  @ApiPropertyOptional({
    description: 'Expiration of message kept on FCM storage',
  })
  @IsOptional()
  @IsInt()
  time_to_live?: number;

  @ApiPropertyOptional({
    description: 'Expiration of message kept on HMS storage',
  })
  @IsOptional()
  @IsString()
  huawei_ttl?: string;

  @ApiPropertyOptional({
    description: 'The package name of the application (Android only)',
  })
  @IsOptional()
  @IsString()
  restricted_package_name?: string;

  @ApiPropertyOptional({
    description:
      'Allows developers to test a request without actually sending a message',
  })
  @IsOptional()
  @IsBoolean()
  dry_run?: boolean;
}

export class PushNotificationRequestDto {
  @ApiProperty({
    description: 'Array of notifications to be sent',
    type: [PushNotificationDto], // Explicitly define array of objects
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PushNotificationDto) // Ensure class-transformer properly processes this
  notifications: PushNotificationDto[];
}

export class PushNotificationResponseDto {
  @ApiProperty({
    description: 'Indicates if the notification request was successful',
  })
  @IsString()
  success: boolean;

  @ApiProperty({ description: 'Total number of notifications sent' })
  @IsInt()
  count: number;

  @ApiPropertyOptional({ description: 'Logs for failed push notifications' })
  @IsArray()
  @IsOptional()
  logs?: Array<{
    type: string;
    platform: string;
    token: string;
    message: string;
    error: string;
  }>;
}
