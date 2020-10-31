import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';

export class Tokens {
  @ApiProperty()
  @IsNotEmpty()
  token1: string;

  @Allow()
  @ApiProperty()
  token2?: string;
}
