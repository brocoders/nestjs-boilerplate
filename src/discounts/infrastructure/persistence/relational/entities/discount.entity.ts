import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { PaymentPlanEntity } from '../../../../../payment-plans/infrastructure/persistence/relational/entities/payment-plan.entity';

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
  name: 'discount',
})
export class DiscountEntity extends EntityRelationalHelper {
  @ManyToOne(() => RegionEntity, { eager: true, nullable: true })
  region?: RegionEntity | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  customer?: UserEntity | null;

  @ManyToOne(() => PaymentPlanEntity, { eager: true, nullable: true })
  plan?: PaymentPlanEntity | null;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isActive: boolean;

  @Column({
    nullable: false,
    type: Date,
  })
  validTo: Date;

  @Column({
    nullable: false,
    type: Date,
  })
  validFrom: Date;

  @Column({
    nullable: false,
    type: Number,
  })
  //@Column({ type: 'decimal', precision: 5, scale: 2 })
  value: number;

  @Column({
    nullable: true,
    type: String,
  })
  type?: string | null;
  //  @Column({
  //   type: 'enum',
  //   enum: DiscountType
  // })
  // type: DiscountType;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
