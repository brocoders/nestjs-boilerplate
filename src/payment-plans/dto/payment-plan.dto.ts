import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentPlanDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
