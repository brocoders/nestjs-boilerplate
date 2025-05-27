import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VendorBillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
