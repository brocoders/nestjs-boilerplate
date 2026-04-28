import { ApiProperty } from '@nestjs/swagger';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export class Product {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  vendorId!: string;

  @ApiProperty({ example: 'sample-shop', nullable: true, required: false })
  vendorSlug?: string;

  @ApiProperty({
    example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0',
    nullable: true,
  })
  categoryId!: string | null;

  @ApiProperty({ example: 'classic-tee' })
  slug!: string;

  @ApiProperty({ example: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' } })
  nameTranslations!: Record<string, string>;

  @ApiProperty({ example: { en: 'Soft cotton.', ar: 'قطن ناعم.' } })
  descriptionTranslations!: Record<string, string>;

  @ApiProperty({ enum: ProductStatus, example: ProductStatus.DRAFT })
  status!: ProductStatus;

  @ApiProperty({ example: 'SAR' })
  baseCurrency!: string;

  @ApiProperty({ type: [String] })
  supportedRegionIds!: string[];

  createdAt!: Date;
  updatedAt!: Date;
}
