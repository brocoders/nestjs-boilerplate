import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
