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
import { ProductEntity } from './product.entity';
import { ProductOptionValueEntity } from './product-option-value.entity';

@Entity({ name: 'product_option_type' })
@Unique('uq_product_option_type_product_slug', ['productId', 'slug'])
@Index(['productId'])
export class ProductOptionTypeEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @ManyToOne(() => ProductEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @Column({ length: 48 })
  slug!: string;

  @Column({ name: 'name_translations', type: 'jsonb' })
  nameTranslations!: Record<string, string>;

  @Column({ type: 'smallint', default: 0 })
  position!: number;

  @OneToMany(() => ProductOptionValueEntity, (v) => v.optionType)
  values!: ProductOptionValueEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
