import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class DatabaseConfigDto {
  @ApiProperty()
  @IsString()
  host: string;

  @ApiProperty()
  @IsNumber()
  port: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  database: string;
}
