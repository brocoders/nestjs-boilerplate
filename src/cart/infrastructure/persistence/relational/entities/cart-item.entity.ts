import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from '../../../../../products/infrastructure/persistence/relational/entities/product-variant.entity';
import { CartEntity } from './cart.entity';

@Entity({ name: 'cart_item' })
@Unique('uq_cart_item_cart_variant', ['cartId', 'variantId'])
@Index(['cartId'])
export class CartItemEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'cart_id', type: 'uuid' })
  cartId!: string;

  @ManyToOne(() => CartEntity, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart!: CartEntity;

  @Column({ name: 'variant_id', type: 'uuid' })
  variantId!: string;

  @ManyToOne(() => ProductVariantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariantEntity;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ name: 'unit_price_snapshot', type: 'bigint' })
  unitPriceSnapshot!: string;

  @Column({ name: 'currency_snapshot', length: 3 })
  currencySnapshot!: string;

  @CreateDateColumn({ name: 'added_at' })
  addedAt!: Date;
}
