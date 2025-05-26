import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
