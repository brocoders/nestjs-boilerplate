import { ApiProperty } from '@nestjs/swagger';
import { VariantPrice } from './variant-price';
import { VariantStock } from './variant-stock';

export class ProductVariantOptionRef {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  optionTypeId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  optionValueId!: string;
}

export class ProductVariant {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  productId!: string;

  @ApiProperty({ example: 'classic-tee-red-m' })
  sku!: string;

  @ApiProperty({ example: 0 })
  weightGrams!: number;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty({ type: () => [ProductVariantOptionRef] })
  optionValueIds!: ProductVariantOptionRef[];

  @ApiProperty({ type: () => [VariantPrice] })
  prices!: VariantPrice[];

  @ApiProperty({ type: () => VariantStock, nullable: true })
  stock!: VariantStock | null;

  createdAt!: Date;
  updatedAt!: Date;
}
