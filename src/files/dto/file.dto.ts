import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;

  path: string;
}
