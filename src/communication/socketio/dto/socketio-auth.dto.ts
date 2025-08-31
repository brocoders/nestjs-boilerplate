import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocketIoReAuthDto {
  @ApiProperty({ description: 'JWT access token for re-authentication' })
  @IsString()
  token: string;
}
