import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class KycDetailsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
