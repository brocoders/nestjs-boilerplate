import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentMethodDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
