import { ApiProperty } from '@nestjs/swagger';

export class RoleSchema {
  @ApiProperty({
    type: String,
  })
  _id: string;

  @ApiProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
