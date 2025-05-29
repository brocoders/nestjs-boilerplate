import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { AuditLogEntry } from '../../../../../common/dto/audit-log-entry.dto';

@Entity({
  name: 'credit_balance',
})
export class CreditBalanceEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @Column({ type: 'jsonb', nullable: true })
  auditLog: AuditLogEntry[] | null;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @OneToOne(() => UserEntity, { eager: true, nullable: false })
  @JoinColumn()
  customer: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
