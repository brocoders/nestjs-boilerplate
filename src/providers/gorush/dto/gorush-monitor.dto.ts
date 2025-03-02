import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GoRushSystemStatsResponseDto {
  @ApiProperty({ description: 'Process ID' })
  @IsInt()
  pid: number;

  @ApiPropertyOptional({ description: 'Hostname of the server' })
  @IsString()
  @IsOptional()
  hostname?: string;

  @ApiProperty({ description: 'Server uptime in human-readable format' })
  @IsString()
  uptime: string;

  @ApiProperty({ description: 'Server uptime in seconds' })
  @IsInt()
  uptime_sec: number;

  @ApiProperty({ description: 'Current server time' })
  @IsString()
  time: string;

  @ApiProperty({ description: 'Current Unix timestamp' })
  @IsInt()
  unixtime: number;

  @ApiProperty({
    description: 'Count of HTTP status codes in the current session',
  })
  @IsObject()
  status_code_count: Record<string, number>;

  @ApiProperty({
    description: 'Total count of HTTP status codes since startup',
  })
  @IsObject()
  total_status_code_count: Record<string, number>;

  @ApiProperty({ description: 'Number of requests in the current session' })
  @IsInt()
  count: number;

  @ApiProperty({ description: 'Total number of requests since startup' })
  @IsInt()
  total_count: number;

  @ApiProperty({ description: 'Total response time in human-readable format' })
  @IsString()
  total_response_time: string;

  @ApiProperty({ description: 'Total response time in seconds' })
  @IsInt()
  total_response_time_sec: number;

  @ApiProperty({ description: 'Total response size in bytes' })
  @IsInt()
  total_response_size: number;

  @ApiProperty({ description: 'Average response size in bytes' })
  @IsInt()
  average_response_size: number;

  @ApiProperty({
    description: 'Average response time in human-readable format',
  })
  @IsString()
  average_response_time: string;

  @ApiProperty({ description: 'Average response time in seconds' })
  @IsInt()
  average_response_time_sec: number;

  @ApiPropertyOptional({ description: 'Total metric counts' })
  @IsObject()
  @IsOptional()
  total_metrics_counts?: Record<string, number>;

  @ApiPropertyOptional({ description: 'Average metric timers' })
  @IsObject()
  @IsOptional()
  average_metrics_timers?: Record<string, number>;
}

export class GoRushMetricsResponseDto {
  @ApiProperty({ description: 'All metrics for the prometheus metrics' })
  @IsString()
  metrics: string;
}

export class GoRushMetricsJsonResponseDto {
  @ApiProperty({ description: 'Structured JSON of Gorush metrics' })
  @IsString()
  metrics: Record<string, any>;
}

export class PushStatsDto {
  @ApiProperty()
  @IsInt()
  push_success: number;

  @ApiProperty()
  @IsInt()
  push_error: number;
}

export class GoRushAppStatusResponseDto {
  @ApiProperty()
  @IsString()
  version: string;

  @ApiProperty()
  @IsInt()
  busy_workers: number;

  @ApiProperty()
  @IsInt()
  success_tasks: number;

  @ApiProperty()
  @IsInt()
  failure_tasks: number;

  @ApiProperty()
  @IsInt()
  submitted_tasks: number;

  @ApiProperty()
  @IsInt()
  total_count: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PushStatsDto)
  @IsObject()
  ios: PushStatsDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PushStatsDto)
  @IsObject()
  android: PushStatsDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => PushStatsDto)
  @IsObject()
  huawei: PushStatsDto;
}
