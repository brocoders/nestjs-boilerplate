import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  AccountTypeEnum,
  NotificationChannelEnum,
  NotificationTypeEnum,
} from '../../../../../utils/enum/account-type.enum';

@Entity({
  name: 'account',
})
export class AccountEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { /**eager: true,**/ nullable: false })
  tenant: TenantEntity;

  @ManyToMany(() => UserEntity, { /**eager: true,**/ nullable: true })
  @JoinTable()
  owner?: UserEntity[] | null;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
    nullable: false,
  })
  type: AccountTypeEnum;

  @Column({
    nullable: false,
    type: Boolean,
  })
  active: boolean;

  @Column({
    nullable: true,
    type: String,
  })
  callbackUrl?: string | null;

  @Column({
    type: 'enum',
    enum: NotificationChannelEnum,
    nullable: true,
  })
  notificationChannel?: NotificationChannelEnum | null;

  @Column({
    type: 'enum',
    enum: NotificationTypeEnum,
    nullable: true,
  })
  notificationType?: NotificationTypeEnum | null;

  @Column({
    nullable: false,
    type: Boolean,
  })
  receiveNotification: boolean;

  @Column({
    nullable: false,
    type: Number,
  })
  balance: number;

  @Column({
    nullable: true,
    type: String,
  })
  number?: string | null;

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

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
