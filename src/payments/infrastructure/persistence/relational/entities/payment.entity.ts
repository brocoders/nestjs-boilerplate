import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { InvoiceEntity } from '../../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';

import { PaymentNotificationEntity } from '../../../../../payment-notifications/infrastructure/persistence/relational/entities/payment-notification.entity';

import { PaymentMethodEntity } from '../../../../../payment-methods/infrastructure/persistence/relational/entities/payment-method.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { TransactionEntity } from '../../../../../transactions/infrastructure/persistence/relational/entities/transaction.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { PaymentStatus } from '../../../../../utils/enum/payment-notification.enums';

@Entity({
  name: 'payment',
})
export class PaymentEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @ManyToOne(() => InvoiceEntity, { eager: true, nullable: true })
  invoice?: InvoiceEntity | null;

  @OneToOne(() => PaymentNotificationEntity, { eager: true, nullable: true })
  @JoinColumn()
  notification?: PaymentNotificationEntity | null;

  @ManyToOne(() => PaymentMethodEntity, { eager: true, nullable: true })
  paymentMethod?: PaymentMethodEntity | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  customer?: UserEntity | null;

  @OneToMany(() => TransactionEntity, (childEntity) => childEntity.payment, {
    eager: true,
    nullable: true,
  })
  transactionId?: TransactionEntity[] | null;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    nullable: false,
    type: Date,
  })
  paymentDate: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  amount: number;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  // @OneToMany(() => PaymentAllocation, allocation => allocation.payment)
  // allocations: PaymentAllocation[];

  //  @OneToMany(() => Reconciliation, recon => recon.payment)
  // reconciliations: Reconciliation[];
}
