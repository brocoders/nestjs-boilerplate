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
import { VendorEntity } from '../../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';
import { CategoryEntity } from '../../../../../categories/infrastructure/persistence/relational/entities/category.entity';
import { ProductStatus } from '../../../../domain/product';

@Entity({ name: 'product' })
@Unique('uq_product_vendor_slug', ['vendorId', 'slug'])
@Index(['status'])
@Index(['categoryId'])
@Index(['vendorId'])
export class ProductEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId!: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vendor_id' })
  vendor!: VendorEntity;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId!: string | null;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity | null;

  @Column({ length: 96 })
  slug!: string;

  @Column({ name: 'name_translations', type: 'jsonb' })
  nameTranslations!: Record<string, string>;

  @Column({
    name: 'description_translations',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  descriptionTranslations!: Record<string, string>;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.DRAFT })
  status!: ProductStatus;

  @Column({ name: 'base_currency', type: 'varchar', length: 3 })
  baseCurrency!: string;

  @Column({
    name: 'supported_region_ids',
    type: 'uuid',
    array: true,
    default: () => 'ARRAY[]::uuid[]',
  })
  supportedRegionIds!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
