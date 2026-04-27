import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'currency' })
export class CurrencyEntity extends EntityRelationalHelper {
  @PrimaryColumn({ length: 3 })
  code!: string;

  @Column({ length: 8 })
  symbol!: string;

  @Column({ name: 'decimal_places', type: 'smallint', default: 2 })
  decimalPlaces!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
