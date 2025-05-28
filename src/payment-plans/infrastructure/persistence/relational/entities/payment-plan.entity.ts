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

export enum PlanType {
  FLAT_MONTHLY = 'FLAT_MONTHLY',
  PER_WEIGHT = 'PER_WEIGHT',
  TIERED = 'TIERED',
  PREPAID = 'PREPAID',
  CREDIT = 'CREDIT',
}

export type RateStructure =
  | { type: 'FLAT'; amount: number }
  | { type: 'PER_UNIT'; rate: number }
  | { type: 'CREDIT_RATE'; rate: number }
  | { type: 'TIERED'; tiers: Tier[] }
  | { type: 'PREPAID'; creditRate: number };

export type Tier = {
  from: number;
  to: number;
  rate: number;
};
@Entity({
  name: 'payment_plan',
})
export class PaymentPlanEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isActive: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  unit: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  minimumCharge: number;

  @Column({ type: 'jsonb', nullable: true })
  rateStructure?: RateStructure | null;

  @Column({
    type: 'enum',
    enum: PlanType,
  })
  type: PlanType;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
