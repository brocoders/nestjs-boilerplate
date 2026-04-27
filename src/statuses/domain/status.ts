import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Status {
  @Allow()
  @ApiProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
