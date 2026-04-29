import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductVariant } from '../../products/domain/product-variant';

export class CartItem {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  cartId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  variantId!: string;

  @ApiProperty({ example: 2 })
  quantity!: number;

  @ApiProperty({ example: '9900' })
  unitPriceSnapshot!: string;

  @ApiProperty({ example: 'SAR' })
  currencySnapshot!: string;

  @ApiProperty()
  addedAt!: Date;

  // Hydrated for buyer-facing GET /cart.
  @ApiPropertyOptional({ type: () => ProductVariant })
  variant?: ProductVariant;

  @ApiPropertyOptional({ example: { en: 'Classic Tee', ar: 'تيشيرت كلاسيك' } })
  productNameTranslations?: Record<string, string>;

  @ApiPropertyOptional({ example: 'classic-tee' })
  productSlug?: string;

  @ApiPropertyOptional({ example: 'sample-shop' })
  vendorSlug?: string;

  @ApiPropertyOptional({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  vendorId?: string;

  @ApiPropertyOptional({ example: null, nullable: true })
  productImageUrl?: string | null;
}
