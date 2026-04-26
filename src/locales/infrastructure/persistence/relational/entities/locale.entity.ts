import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'locale' })
@Unique(['code'])
export class LocaleEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ length: 8 })
  code!: string;

  @Column({ name: 'native_name', length: 64 })
  nativeName!: string;

  @Column({ name: 'is_rtl', default: false })
  isRtl!: boolean;

  @Column({ name: 'is_enabled', default: true })
  isEnabled!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
