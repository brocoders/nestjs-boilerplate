import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FireblocksNcwWalletDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
