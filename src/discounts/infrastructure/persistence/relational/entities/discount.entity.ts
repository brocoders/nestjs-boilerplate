import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

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
import { DiscountTypeEnum } from '../../../../../utils/enum/account-type.enum';

@Entity({
  name: 'discount',
})
export class DiscountEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({
    nullable: true,
    type: Number,
  })
  minVolume?: number | null;

  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

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
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: false,
    default: 0.0,
  })
  value: number;

  @Column({
    type: 'enum',
    enum: DiscountTypeEnum,
    nullable: false,
  })
  type: DiscountTypeEnum;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
