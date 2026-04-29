import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ShippingZone {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  vendorId!: string;

  @ApiProperty({ example: 'Saudi Arabia — main cities' })
  name!: string;

  @ApiProperty({ type: [String], example: ['SA'] })
  countryCodes!: string[];

  @ApiProperty({ type: [String], example: [] })
  regionCodes!: string[];

  @ApiProperty({ example: '2500' })
  costMinorUnits!: string;

  @ApiProperty({ example: 'SAR' })
  currencyCode!: string;

  @ApiPropertyOptional({ example: '20000', nullable: true })
  freeAboveMinorUnits!: string | null;

  @ApiProperty({ example: 2 })
  estDeliveryDaysMin!: number;

  @ApiProperty({ example: 5 })
  estDeliveryDaysMax!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
