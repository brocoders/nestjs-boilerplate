import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from './product-variant.entity';

@Entity({ name: 'variant_stock' })
export class VariantStockEntity extends EntityRelationalHelper {
  @PrimaryColumn({ name: 'variant_id', type: 'uuid' })
  variantId!: string;

  @OneToOne(() => ProductVariantEntity, (v) => v.stock, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariantEntity;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ name: 'reserved_quantity', type: 'int', default: 0 })
  reservedQuantity!: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
