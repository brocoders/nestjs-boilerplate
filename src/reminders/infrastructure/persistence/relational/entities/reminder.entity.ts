import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { InvoiceEntity } from '../../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

export enum ReminderChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export enum ReminderStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}
@Entity({
  name: 'reminder',
})
export class ReminderEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  message?: string | null;

  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  user?: UserEntity | null;

  @ManyToOne(() => InvoiceEntity, { eager: true, nullable: true })
  invoice?: InvoiceEntity | null;

  @Column({
    type: 'enum',
    enum: ReminderChannel,
  })
  channel: ReminderChannel;

  @Column({
    type: 'enum',
    enum: ReminderStatus,
    default: ReminderStatus.SCHEDULED,
  })
  status: ReminderStatus;

  @Column({
    nullable: false,
    type: Date,
  })
  scheduledAt: Date;

  @Column({
    nullable: true,
    type: Date,
  })
  sentAt?: Date | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
