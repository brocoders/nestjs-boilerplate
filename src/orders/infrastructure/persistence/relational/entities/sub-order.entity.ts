import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { VendorEntity } from '../../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';
import { SubOrderFulfillmentStatus } from '../../../../domain/order-enums';
import { OrderEntity } from './order.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'sub_order' })
@Unique('uq_sub_order_order_vendor', ['orderId', 'vendorId'])
@Index('idx_sub_order_vendor_status', ['vendorId', 'fulfillmentStatus'])
export class SubOrderEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @ManyToOne(() => OrderEntity, (o) => o.subOrders, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId!: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vendor_id' })
  vendor!: VendorEntity;

  @Column({ name: 'subtotal_minor', type: 'bigint' })
  subtotalMinor!: string;

  @Column({ name: 'shipping_minor', type: 'bigint' })
  shippingMinor!: string;

  @Column({ name: 'total_minor', type: 'bigint' })
  totalMinor!: string;

  @Column({
    name: 'fulfillment_status',
    type: 'enum',
    enum: SubOrderFulfillmentStatus,
    enumName: 'sub_order_fulfillment_status_enum',
    default: SubOrderFulfillmentStatus.AWAITING_CONFIRMATION,
  })
  fulfillmentStatus!: SubOrderFulfillmentStatus;

  @Column({
    name: 'tracking_number',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  trackingNumber!: string | null;

  @Column({ name: 'courier_name', type: 'varchar', length: 64, nullable: true })
  courierName!: string | null;

  @Column({ name: 'packed_at', type: 'timestamptz', nullable: true })
  packedAt!: Date | null;

  @Column({ name: 'shipped_at', type: 'timestamptz', nullable: true })
  shippedAt!: Date | null;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt!: Date | null;

  @OneToMany(() => OrderItemEntity, (i) => i.subOrder)
  items!: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
