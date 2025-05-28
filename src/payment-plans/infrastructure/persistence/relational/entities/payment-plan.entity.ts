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
    nullable: false,
    type: Number,
  })
  // @Column({ type: 'decimal', precision: 10, scale: 2 })
  minimumCharge: number;

  @Column({
    nullable: true,
    type: String,
  })
  rateStructure?: string | null;

  // @Column({ type: 'jsonb' })
  // rateStructure: RateStructure;

  @Column({
    nullable: true,
    type: String,
  })
  type?: string | null;

  // @Column({
  //   type: 'enum',
  //   enum: PlanType
  // })
  // type: PlanType;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// export enum PlanType {
//   FLAT_MONTHLY = 'FLAT_MONTHLY',
//   PER_WEIGHT = 'PER_WEIGHT',
//   TIERED = 'TIERED',
//   PREPAID = 'PREPAID',
//   CREDIT = 'CREDIT'
// }

// type RateStructure =
//   | { type: 'FLAT'; amount: number }
//   | { type: 'PER_UNIT'; rate: number }
//   | { type: 'CREDIT_RATE'; rate: number }
//   | { type: 'TIERED'; tiers: Tier[] }
//   | { type: 'PREPAID'; creditRate: number };

// type Tier = {
//   from: number;
//   to: number;
//   rate: number;
// };
