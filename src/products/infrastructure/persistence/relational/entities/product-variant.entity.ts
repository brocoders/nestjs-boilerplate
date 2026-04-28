import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductEntity } from './product.entity';
import { ProductVariantOptionValueEntity } from './product-variant-option-value.entity';
import { VariantPriceEntity } from './variant-price.entity';
import { VariantStockEntity } from './variant-stock.entity';

@Entity({ name: 'product_variant' })
@Unique('uq_product_variant_product_sku', ['productId', 'sku'])
@Index(['productId'])
export class ProductVariantEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ length: 64 })
  sku!: string;

  @Column({ name: 'weight_grams', type: 'int', default: 0 })
  weightGrams!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @OneToMany(() => ProductVariantOptionValueEntity, (v) => v.variant)
  optionValues!: ProductVariantOptionValueEntity[];

  @OneToMany(() => VariantPriceEntity, (p) => p.variant)
  prices!: VariantPriceEntity[];

  @OneToOne(() => VariantStockEntity, (s) => s.variant)
  stock!: VariantStockEntity | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
