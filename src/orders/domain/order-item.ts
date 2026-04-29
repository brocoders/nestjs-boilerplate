import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderItem {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  subOrderId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  variantId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  productId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  vendorId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '9900' })
  unitPriceSnapshot!: string;

  @ApiProperty({ example: 'SAR' })
  currencySnapshot!: string;

  @ApiProperty({ example: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' } })
  nameSnapshotTranslations!: Record<string, string>;

  @ApiPropertyOptional({ example: null, nullable: true })
  imageSnapshotUrl!: string | null;

  @ApiProperty({ example: 'classic-tee-red-m' })
  skuSnapshot!: string;

  createdAt!: Date;
}
