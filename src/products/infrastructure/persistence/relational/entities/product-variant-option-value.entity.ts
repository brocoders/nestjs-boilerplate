import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ProductVariantEntity } from './product-variant.entity';
import { ProductOptionTypeEntity } from './product-option-type.entity';
import { ProductOptionValueEntity } from './product-option-value.entity';

// Composite PK on (variant_id, option_type_id) ensures a variant has
// exactly one value per option type. Uniqueness of (product_id, set of
// option_value_ids) is enforced at the application layer in
// ProductsService.generateVariants.
@Entity({ name: 'product_variant_option_value' })
export class ProductVariantOptionValueEntity extends EntityRelationalHelper {
  @PrimaryColumn({ name: 'variant_id', type: 'uuid' })
  variantId!: string;

  @PrimaryColumn({ name: 'option_type_id', type: 'uuid' })
  optionTypeId!: string;

  @Column({ name: 'option_value_id', type: 'uuid' })
  optionValueId!: string;

  @ManyToOne(() => ProductVariantEntity, (v) => v.optionValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant!: ProductVariantEntity;

  @ManyToOne(() => ProductOptionTypeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_type_id' })
  optionType!: ProductOptionTypeEntity;

  @ManyToOne(() => ProductOptionValueEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_value_id' })
  optionValue!: ProductOptionValueEntity;
}
