import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
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
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

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
