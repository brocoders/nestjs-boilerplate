import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({
    type: String,
    example: 'userId',
  })
  @IsNotEmpty()
  id: string | number;
}
