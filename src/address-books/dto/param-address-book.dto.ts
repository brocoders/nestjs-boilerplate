import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumberString } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ description: 'AddressBook ID (UUID)' })
  @IsUUID()
  id: string;
}

export class UserIdParamDto {
  @ApiProperty({
    description: 'User ID (numeric)',
    type: String, // explicitly define as string for Swagger
    example: '123',
  })
  @IsNumberString()
  userId: string;
}
