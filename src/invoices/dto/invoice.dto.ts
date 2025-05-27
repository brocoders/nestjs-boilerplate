import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InvoiceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
