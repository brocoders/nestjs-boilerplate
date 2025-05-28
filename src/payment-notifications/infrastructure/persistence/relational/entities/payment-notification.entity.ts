import { PaymentAggregatorEntity } from '../../../../../payment-aggregators/infrastructure/persistence/relational/entities/payment-aggregator.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  PaymentStatus,
  PaymentMethod,
  Currency,
  PaymentProvider,
} from '../../../../../utils/enum/payment-notification.enums';

@Entity({
  name: 'payment_notification',
})
export class PaymentNotificationEntity extends EntityRelationalHelper {
  @ManyToOne(
    () => PaymentAggregatorEntity,
    (parentEntity) => parentEntity.notifications,
    { eager: false, nullable: false },
  )
  aggregator: PaymentAggregatorEntity;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  processed_at?: Date | null;

  @Column({
    nullable: false,
    type: 'boolean',
    default: false,
  })
  processed: boolean;

  @Column({ type: 'jsonb', nullable: false })
  raw_payload: object;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    nullable: false,
  })
  status: PaymentStatus;

  @Column({
    nullable: false,
    type: 'timestamp',
  })
  received_at: Date;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: false,
  })
  payment_method: PaymentMethod;

  @Column({
    type: 'enum',
    enum: Currency,
    nullable: false,
  })
  currency: Currency;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  amount: number;

  @Column({
    nullable: false,
    type: 'varchar',
  })
  external_txn_id: string;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
    nullable: false,
  })
  provider: PaymentProvider;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
