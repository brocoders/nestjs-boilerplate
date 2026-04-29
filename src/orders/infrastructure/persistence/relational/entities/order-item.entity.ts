import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product-variant.entity';
import { SubOrderEntity } from './sub-order.entity';

@Entity({ name: 'order_item' })
@Index('idx_order_item_sub_order_id', ['subOrderId'])
export class OrderItemEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'sub_order_id', type: 'uuid' })
  subOrderId!: string;

  @ManyToOne(() => SubOrderEntity, (s) => s.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sub_order_id' })
  subOrder!: SubOrderEntity;

  @Column({ name: 'variant_id', type: 'uuid' })
  variantId!: string;

  @ManyToOne(() => ProductVariantEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariantEntity;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'unit_price_snapshot', type: 'bigint' })
  unitPriceSnapshot!: string;

  @Column({ name: 'currency_snapshot', length: 3 })
  currencySnapshot!: string;

  @Column({ name: 'name_snapshot_translations', type: 'jsonb' })
  nameSnapshotTranslations!: Record<string, string>;

  @Column({ name: 'image_snapshot_url', type: 'text', nullable: true })
  imageSnapshotUrl!: string | null;

  @Column({ name: 'sku_snapshot', length: 64 })
  skuSnapshot!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
