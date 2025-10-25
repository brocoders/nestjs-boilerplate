import { ApiProperty } from '@nestjs/swagger';

export class WebhookResponseDto {
  @ApiProperty({ example: 'received', description: 'Status of processing' })
  status: string;
}
