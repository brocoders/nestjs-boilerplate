import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ExemptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
