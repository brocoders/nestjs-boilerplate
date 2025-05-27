import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountsPayableDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
