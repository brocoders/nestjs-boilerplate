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
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { AddressSnapshot } from '../../../../domain/address-snapshot';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
} from '../../../../domain/order-enums';
import { SubOrderEntity } from './sub-order.entity';

@Entity({ name: 'order' })
@Unique('uq_order_public_code', ['publicCode'])
@Index('idx_order_buyer_placed_at', ['buyerId', 'placedAt'])
@Index('idx_order_public_code', ['publicCode'])
export class OrderEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'buyer_id', type: 'int' })
  buyerId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'buyer_id' })
  buyer!: UserEntity;

  @Column({ name: 'public_code', length: 16 })
  publicCode!: string;

  @Column({ name: 'region_id', type: 'uuid' })
  regionId!: string;

  @ManyToOne(() => RegionEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'region_id' })
  region!: RegionEntity;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode!: string;

  @Column({ name: 'subtotal_minor', type: 'bigint' })
  subtotalMinor!: string;

  @Column({ name: 'shipping_minor', type: 'bigint' })
  shippingMinor!: string;

  @Column({ name: 'total_minor', type: 'bigint' })
  totalMinor!: string;

  @Column({
    name: 'payment_method',
    type: 'enum',
    enum: OrderPaymentMethod,
    enumName: 'order_payment_method_enum',
  })
  paymentMethod!: OrderPaymentMethod;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: OrderPaymentStatus,
    enumName: 'order_payment_status_enum',
    default: OrderPaymentStatus.PENDING,
  })
  paymentStatus!: OrderPaymentStatus;

  @Column({ name: 'address_snapshot', type: 'jsonb' })
  addressSnapshot!: AddressSnapshot;

  @Column({ name: 'placed_at', type: 'timestamptz', default: () => 'now()' })
  placedAt!: Date;

  @OneToMany(() => SubOrderEntity, (s) => s.order)
  subOrders!: SubOrderEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
