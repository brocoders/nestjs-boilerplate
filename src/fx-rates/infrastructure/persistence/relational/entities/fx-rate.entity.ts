import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'fx_rate' })
@Unique('uq_fx_rate_pair_day', ['baseCurrency', 'quoteCurrency', 'fetchedDate'])
@Index(['baseCurrency', 'quoteCurrency'])
export class FxRateEntity extends EntityRelationalHelper {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'base_currency', length: 3 })
  baseCurrency!: string;

  @Column({ name: 'quote_currency', length: 3 })
  quoteCurrency!: string;

  @Column({ type: 'numeric', precision: 18, scale: 8 })
  rate!: string;

  @Column({ name: 'fetched_date', type: 'date' })
  fetchedDate!: string;

  @Column({ length: 32, default: 'exchangerate.host' })
  source!: string;

  @CreateDateColumn({ name: 'fetched_at' })
  fetchedAt!: Date;
}
