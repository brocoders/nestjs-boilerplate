import { ApiProperty } from '@nestjs/swagger';
import { AddressSnapshot } from './address-snapshot';
import { OrderPaymentMethod, OrderPaymentStatus } from './order-enums';
import { SubOrder } from './sub-order';

export class Order {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: 42 })
  buyerId!: number;

  @ApiProperty({ example: 'ORD-42K9X3' })
  publicCode!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  regionId!: string;

  @ApiProperty({ example: 'SAR' })
  currencyCode!: string;

  @ApiProperty({ example: '19800' })
  subtotalMinor!: string;

  @ApiProperty({ example: '2500' })
  shippingMinor!: string;

  @ApiProperty({ example: '22300' })
  totalMinor!: string;

  @ApiProperty({ enum: OrderPaymentMethod, example: OrderPaymentMethod.COD })
  paymentMethod!: OrderPaymentMethod;

  @ApiProperty({
    enum: OrderPaymentStatus,
    example: OrderPaymentStatus.PENDING,
  })
  paymentStatus!: OrderPaymentStatus;

  @ApiProperty({ type: () => AddressSnapshot })
  addressSnapshot!: AddressSnapshot;

  @ApiProperty()
  placedAt!: Date;

  @ApiProperty({ type: () => [SubOrder] })
  subOrders!: SubOrder[];

  createdAt!: Date;
  updatedAt!: Date;
}
