import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { ExemptionEntity } from '../../../../../exemptions/infrastructure/persistence/relational/entities/exemption.entity';

import { DiscountEntity } from '../../../../../discounts/infrastructure/persistence/relational/entities/discount.entity';

import { AccountsReceivableEntity } from '../../../../../accounts-receivables/infrastructure/persistence/relational/entities/accounts-receivable.entity';

import { PaymentPlanEntity } from '../../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  JoinTable,
  ManyToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export interface Breakdown {
  baseAmount: number;
  discounts: number;
  tax: number;
  adjustments: number;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
  FAILED = 'FAILED',
}
@Entity({
  name: 'invoice',
})
export class InvoiceEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
  })
  invoiceNumber: string;

  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @ManyToOne(() => ExemptionEntity, { eager: true, nullable: true })
  exemption?: ExemptionEntity | null;

  @ManyToOne(() => DiscountEntity, { eager: true, nullable: true })
  discount?: DiscountEntity | null;

  @OneToOne(() => AccountsReceivableEntity, { eager: true, nullable: true })
  @JoinColumn()
  accountsReceivable?: AccountsReceivableEntity | null;

  // @OneToMany(() => PaymentAllocation, allocation => allocation.invoice)
  // allocations: PaymentAllocation[];
  // @ManyToOne(() => TaxConfiguration, tax => tax.invoices)
  // taxConfiguration: TaxConfiguration;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountDue?: number | null;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amountPaid?: number | null;
  @ManyToMany(() => PaymentPlanEntity, { eager: true, nullable: true })
  @JoinTable()
  plan?: PaymentPlanEntity[] | null;

  @Column({ type: 'jsonb' })
  breakdown?: {
    baseAmount: number;
    discounts: number;
    tax: number;
    adjustments: number;
  } | null;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  // @Column({ type: 'uuid' })
  // billingCycleId: string;

  @Column({
    nullable: true,
    type: Date,
  })
  dueDate?: Date | null;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  customer?: UserEntity | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
