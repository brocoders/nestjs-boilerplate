import { ApiProperty } from '@nestjs/swagger';

export class VariantPrice {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  variantId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  regionId!: string;

  @ApiProperty({ example: 'SAR' })
  currencyCode!: string;

  @ApiProperty({ example: '9900' })
  priceMinorUnits!: string;

  @ApiProperty({ example: '12900', nullable: true })
  compareAtPriceMinorUnits!: string | null;

  createdAt!: Date;
  updatedAt!: Date;
}
