import { ApiProperty } from '@nestjs/swagger';

export class Currency {
  @ApiProperty({ example: 'SAR' })
  code!: string;

  @ApiProperty({ example: 'ر.س' })
  symbol!: string;

  @ApiProperty({ example: 2 })
  decimalPlaces!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
