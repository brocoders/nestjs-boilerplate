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

@Entity({ name: 'category' })
@Unique('uq_category_slug', ['slug'])
@Index(['parentId'])
@Index(['isActive'])
export class CategoryEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId!: string | null;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent!: CategoryEntity | null;

  @Column({ length: 64 })
  slug!: string;

  @Column({ name: 'name_translations', type: 'jsonb' })
  nameTranslations!: Record<string, string>;

  @Column({ type: 'varchar', length: 128, nullable: true })
  icon!: string | null;

  @Column({ type: 'smallint', default: 0 })
  position!: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
