import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreditBalanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
