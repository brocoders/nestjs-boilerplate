import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthConfirmDto {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
