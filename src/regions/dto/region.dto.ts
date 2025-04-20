import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
