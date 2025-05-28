import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { PaymentNotificationEntity } from '../../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export interface PaymentConfig {
  webhookUrl: string;

  authToken: string;

  reconciliationWindow: number;
}

@Entity({
  name: 'payment_aggregator',
})
export class PaymentAggregatorEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @Column({ type: 'jsonb', nullable: true })
  config?: {
    webhookUrl: string;
    authToken: string;
    reconciliationWindow: number;
  } | null;

  @Column({
    nullable: true,
    type: String,
  })
  name?: string | null;

  @OneToMany(
    () => PaymentNotificationEntity,
    (childEntity) => childEntity.aggregator,
    { eager: true, nullable: true },
  )
  notifications?: PaymentNotificationEntity[] | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
