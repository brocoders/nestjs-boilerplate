import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { PaymentPlanEntity } from '../../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { PlanStatusEnum } from '../../../../../utils/enum/plan-type.enum';

@Entity({
  name: 'subscription',
})
export class SubscriptionEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @Column({ type: 'jsonb', nullable: true })
  customSchedule?: {
    lastPaymentDate: Date;
    paymentCount: number;
    nextPaymentDates?: Date[];
  } | null;

  @Column({
    nullable: true,
    type: Date,
  })
  nextPaymentDate?: Date | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  assignedBy?: UserEntity | null;

  @Column({
    type: 'enum',
    enum: PlanStatusEnum,
    nullable: false,
    default: PlanStatusEnum.ACTIVE,
  })
  status: PlanStatusEnum;

  @Column({ type: 'jsonb', nullable: true })
  customRates: Record<string, any>;
  @Column({
    nullable: true,
    type: Date,
  })
  endDate?: Date | null;

  @Column({
    nullable: false,
    type: Date,
  })
  startDate: Date;

  @ManyToMany(() => PaymentPlanEntity, { eager: true, nullable: false })
  @JoinTable()
  plan: PaymentPlanEntity[];

  @ManyToMany(() => UserEntity, { eager: true, nullable: false })
  @JoinTable()
  customer: UserEntity[];

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
