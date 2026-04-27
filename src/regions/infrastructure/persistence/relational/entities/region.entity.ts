import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'region' })
@Unique(['code'])
@Index('idx_region_default_unique', ['isDefault'], {
  unique: true,
  where: '"is_default" = true',
})
export class RegionEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 2 })
  code!: string;

  @Column({ name: 'name_translations', type: 'jsonb' })
  nameTranslations!: Record<string, string>;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode!: string;

  @Column({ name: 'default_locale', length: 8 })
  defaultLocale!: string;

  @Column({ name: 'is_enabled', default: true })
  isEnabled!: boolean;

  @Column({ name: 'is_default', default: false })
  isDefault!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
