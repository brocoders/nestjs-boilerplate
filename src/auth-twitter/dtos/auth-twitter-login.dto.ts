import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthTwitterLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  accessTokenKey: string;

  @ApiProperty({ example: 'abc' })
  @IsNotEmpty()
  accessTokenSecret: string;
}
