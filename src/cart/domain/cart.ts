import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from './cart-item';

export class Cart {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: 42 })
  userId!: number;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  regionId!: string;

  @ApiProperty({ example: 'SAR' })
  currencyCode!: string;

  @ApiProperty({ type: () => [CartItem] })
  items!: CartItem[];

  createdAt!: Date;
  updatedAt!: Date;
}
