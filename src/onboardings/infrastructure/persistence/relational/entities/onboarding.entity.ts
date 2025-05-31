import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Index,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
export enum OnboardingEntityType {
  USER = 'user',
  TENANT = 'tenant',
}

export enum OnboardingStepStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  FAILED = 'failed',
  NOT_APPLICABLE = 'not_applicable',
}
@Entity({
  name: 'onboarding',
})
export class OnboardingEntity extends EntityRelationalHelper {
  @ManyToOne(
    () => TenantEntity,
    (parentEntity) => parentEntity.onboardingSteps,
    { eager: false, nullable: false },
  )
  performedByTenant: TenantEntity;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.onboardingSteps, {
    eager: false,
    nullable: false,
  })
  performedByUser: UserEntity;

  @Column({
    nullable: true,
    type: Date,
  })
  completedAt?: Date | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isSkippable: boolean;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isRequired: boolean;

  @Column({
    nullable: false,
    type: Number,
  })
  order: number;

  @Column({
    type: 'enum',
    enum: OnboardingStepStatus,
    default: OnboardingStepStatus.PENDING,
  })
  status: OnboardingStepStatus;

  @Column({
    nullable: false,
    type: String,
  })
  description: string;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: String,
  })
  stepKey: string;

  @Index()
  @Column({
    type: 'enum',
    enum: OnboardingEntityType,
  })
  entityType: OnboardingEntityType;

  // @ManyToOne(() => TenantEntity, { eager: true, nullable: true })
  // tenant?: TenantEntity | null;

  // @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  // user?: UserEntity | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
