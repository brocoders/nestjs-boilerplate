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

@Entity({
  name: 'reminder',
})
export class ReminderEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  user?: UserEntity | null;

  @ManyToOne(() => InvoiceEntity, { eager: true, nullable: true })
  invoice?: InvoiceEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  channel?: string | null;
  // @Column({
  //   type: 'enum',
  //   enum: ReminderChannel
  // })
  // channel: ReminderChannel;

  @Column({
    nullable: true,
    type: String,
  })
  status?: string | null;
  //   @Column({
  //   type: 'enum',
  //   enum: ReminderStatus,
  //   default: ReminderStatus.SCHEDULED
  // })
  // status: ReminderStatus;

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
