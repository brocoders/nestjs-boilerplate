import { ApiProperty } from '@nestjs/swagger';

export class CustomScheduleDto {
  @ApiProperty({ type: String, format: 'date-time' })
  lastPaymentDate: Date;

  @ApiProperty()
  paymentCount: number;
}
