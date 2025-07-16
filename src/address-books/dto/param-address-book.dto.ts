import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumberString, IsOptional } from 'class-validator';

export class IdParamDto {
  @ApiProperty({ description: 'AddressBook ID (UUID)' })
  @IsUUID()
  id: string;
}

export class BaseUserIdParamDto {
  @ApiProperty({ description: 'User ID (numeric)' })
  @IsNumberString()
  @IsOptional()
  userId: number | string;
}

export class UserIdParamDto extends BaseUserIdParamDto {}
