import { ApiProperty } from '@nestjs/swagger';

export class VariantStock {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  variantId!: string;

  @ApiProperty({ example: 25 })
  quantity!: number;

  @ApiProperty({ example: 0 })
  reservedQuantity!: number;

  updatedAt!: Date;
}
