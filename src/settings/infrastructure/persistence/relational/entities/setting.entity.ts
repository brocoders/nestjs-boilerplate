import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { SettingsShape } from '../../../../domain/setting';

@Entity({ name: 'setting' })
export class SettingEntity extends EntityRelationalHelper {
  // Always 1 — singleton pattern
  @PrimaryColumn({ name: 'id', type: 'smallint' })
  id!: number;

  @Column({ type: 'jsonb' })
  values!: SettingsShape;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
