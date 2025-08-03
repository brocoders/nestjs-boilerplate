import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FireblocksCwWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
