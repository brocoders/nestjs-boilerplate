import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

export enum KycSubjectType {
  USER = 'user',
  TENANT = 'tenant',
}

export enum KycStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}
@Entity({
  name: 'kyc_details',
})
export class KycDetailsEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Number,
  })
  verifiedBy?: number | null;

  @Column({
    nullable: true,
    type: Date,
  })
  verifiedAt?: Date | null;

  @Column({
    nullable: true,
    type: Date,
  })
  submittedAt?: Date | null;

  @Column({
    type: 'enum',
    enum: KycStatus,
    default: KycStatus.PENDING,
  })
  status: KycStatus;

  @Column({ type: 'jsonb', nullable: true })
  documentData: {
    frontUrl?: string;
    backUrl?: string;
    expiryDate?: Date;
  };

  @Column({
    nullable: true,
    type: String,
  })
  documentNumber?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  documentType?: string | null;

  @Column({
    type: 'enum',
    enum: KycSubjectType,
  })
  subjectType: KycSubjectType;

  @ManyToOne(
    () => TenantEntity,
    (parentEntity) => parentEntity.kycSubmissions,
    { eager: false, nullable: false },
  )
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.kycSubmissions, {
    eager: false,
    nullable: false,
  })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
