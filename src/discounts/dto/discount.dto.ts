import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DiscountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
