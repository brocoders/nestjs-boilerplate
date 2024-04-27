import { ApiResponseProperty } from '@nestjs/swagger';

export class StatusSchema {
  @ApiResponseProperty({
    type: String,
  })
  _id: string;

  @ApiResponseProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
