import { ApiProperty } from '@nestjs/swagger';
import { ProductOptionValue } from './product-option-value';

export class ProductOptionType {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  productId!: string;

  @ApiProperty({ example: 'color' })
  slug!: string;

  @ApiProperty({ example: { en: 'Color', ar: 'اللون' } })
  nameTranslations!: Record<string, string>;

  @ApiProperty({ example: 0 })
  position!: number;

  @ApiProperty({ type: () => [ProductOptionValue] })
  values!: ProductOptionValue[];

  createdAt!: Date;
  updatedAt!: Date;
}
