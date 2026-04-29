import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubOrderFulfillmentStatus } from './order-enums';
import { OrderItem } from './order-item';

export class SubOrder {
  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  id!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  orderId!: string;

  @ApiProperty({ example: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0' })
  vendorId!: string;

  @ApiProperty({ example: '19800' })
  subtotalMinor!: string;

  @ApiProperty({ example: '2500' })
  shippingMinor!: string;

  @ApiProperty({ example: '22300' })
  totalMinor!: string;

  @ApiProperty({
    enum: SubOrderFulfillmentStatus,
    example: SubOrderFulfillmentStatus.AWAITING_CONFIRMATION,
  })
  fulfillmentStatus!: SubOrderFulfillmentStatus;

  @ApiPropertyOptional({ example: null, nullable: true })
  trackingNumber!: string | null;

  @ApiPropertyOptional({ example: null, nullable: true })
  courierName!: string | null;

  @ApiPropertyOptional({ nullable: true })
  packedAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  shippedAt!: Date | null;

  @ApiPropertyOptional({ nullable: true })
  deliveredAt!: Date | null;

  @ApiProperty({ type: () => [OrderItem] })
  items!: OrderItem[];

  createdAt!: Date;
  updatedAt!: Date;
}
