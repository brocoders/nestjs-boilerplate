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

@Entity({
  name: 'customer_plan',
})
export class CustomerPlanEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  customSchedule?: string | null;

  // @Column({ type: 'jsonb' })
  // customSchedule: {
  //   lastPaymentDate: Date;
  //   paymentCount: number;
  // };

  @Column({
    nullable: true,
    type: Date,
  })
  nextPaymentDate?: Date | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  assignedBy?: UserEntity | null;

  @Column({
    nullable: false,
    type: String,
  })
  status: string;

  // @Column({
  //   type: 'enum',
  //   enum: PlanStatus,
  //   nullable: false,
  //   default: PlanStatus.ACTIVE,
  // })
  // status: PlanStatus;

  @Column({
    nullable: true,
    type: String,
  })
  customRates?: string | null;

  // @Column({ type: 'jsonb', nullable: true })
  // customRates: Record<string, any>;
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
