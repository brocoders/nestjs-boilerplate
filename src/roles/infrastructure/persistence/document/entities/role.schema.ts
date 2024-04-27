import { ApiResponseProperty } from '@nestjs/swagger';

export class RoleSchema {
  @ApiResponseProperty({
    type: String,
  })
  _id: string;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
