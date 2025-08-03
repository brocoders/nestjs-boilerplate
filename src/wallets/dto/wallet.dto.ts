import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
