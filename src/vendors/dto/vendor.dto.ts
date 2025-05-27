import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VendorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
