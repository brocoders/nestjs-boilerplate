import { PaymentNotificationEntity } from '../../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
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
