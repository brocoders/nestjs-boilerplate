import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from './product-variant.entity';
import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';

@Entity({ name: 'variant_price' })
@Unique('uq_variant_price_variant_region', ['variantId', 'regionId'])
@Index(['variantId'])
@Index(['regionId'])
export class VariantPriceEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'variant_id', type: 'uuid' })
  variantId!: string;

  @ManyToOne(() => ProductVariantEntity, (v) => v.prices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariantEntity;

  @Column({ name: 'region_id', type: 'uuid' })
  regionId!: string;

  @ManyToOne(() => RegionEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'region_id' })
  region!: RegionEntity;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode!: string;

  @Column({ name: 'price_minor_units', type: 'bigint' })
  priceMinorUnits!: string;

  @Column({
    name: 'compare_at_price_minor_units',
    type: 'bigint',
    nullable: true,
  })
  compareAtPriceMinorUnits!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
