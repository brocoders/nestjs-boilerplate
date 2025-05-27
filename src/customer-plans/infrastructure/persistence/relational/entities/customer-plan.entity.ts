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
  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  assignedBy?: UserEntity | null;

  @Column({
    nullable: false,
    type: String,
  })
  status: string;

  @Column({
    nullable: true,
    type: String,
  })
  customRates?: string | null;

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
