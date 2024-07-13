import { ApiProperty } from '@nestjs/swagger';

export class StatusSchema {
  @ApiProperty({
    type: String,
  })
  _id: string;

  @ApiProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
