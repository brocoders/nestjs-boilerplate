import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class WebhookRequestDto {
  @ApiProperty({
    description: 'Name of the event being triggered',
    example: 'TEST_EVENT',
  })
  @IsString()
  event: string;

  @ApiPropertyOptional({
    description: 'Payload data for the webhook event',
    example: {
      message: 'Hello from test webhook',
      timestamp: '2025-08-03T12:34:56.789Z',
    },
  })
  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
