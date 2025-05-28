import { ApiProperty } from '@nestjs/swagger';

export class AuditLogEntry {
  @ApiProperty({ type: String, example: '2025-05-28T12:34:56.789Z' })
  date: Date;

  @ApiProperty({ type: Number, example: 100.5 })
  amount: number;

  @ApiProperty({ enum: ['ADD', 'DEDUCT'], example: 'ADD' })
  type: 'ADD' | 'DEDUCT';

  @ApiProperty({ type: String, example: 'REF1234' })
  reference: string;
}
