import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

export interface PaymentMethodConfig {
  provider: string;
  apiKey: string;
  sandboxMode: boolean;
}
@Entity({
  name: 'payment_method',
})
export class PaymentMethodEntity extends EntityRelationalHelper {
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  config?: PaymentMethodConfig | null;

  @Column({
    nullable: false,
    type: String,
  })
  processorType: string;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
