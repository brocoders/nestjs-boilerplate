import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumberString } from 'class-validator';

export class IdParamDto {
  @ApiProperty({
    description: 'Wallet ID (UUID)',
    type: String,
    example: 'f7a9f2b4-9e0c-4e4f-a610-52c2d3a6b8b4',
  })
  @IsUUID()
  id: string;
}

export class UserIdParamDto {
  @ApiProperty({
    description: 'User ID (numeric)',
    type: String,
    example: '123',
  })
  @IsNumberString()
  userId: string;
}
