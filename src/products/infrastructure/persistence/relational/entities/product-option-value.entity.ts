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
import { ProductOptionTypeEntity } from './product-option-type.entity';

@Entity({ name: 'product_option_value' })
@Unique('uq_product_option_value_type_slug', ['optionTypeId', 'slug'])
@Index(['optionTypeId'])
export class ProductOptionValueEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'option_type_id', type: 'uuid' })
  optionTypeId!: string;

  @ManyToOne(() => ProductOptionTypeEntity, (t) => t.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_type_id' })
  optionType!: ProductOptionTypeEntity;

  @Column({ length: 48 })
  slug!: string;

  @Column({ name: 'value_translations', type: 'jsonb' })
  valueTranslations!: Record<string, string>;

  @Column({ name: 'swatch_color', type: 'varchar', length: 9, nullable: true })
  swatchColor!: string | null;

  @Column({ type: 'smallint', default: 0 })
  position!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
