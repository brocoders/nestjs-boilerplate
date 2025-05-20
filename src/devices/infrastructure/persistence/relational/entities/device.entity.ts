import { NotificationEntity } from '../../../../../notifications/infrastructure/persistence/relational/entities/notification.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'device',
})
export class DeviceEntity extends EntityRelationalHelper {
  @OneToMany(() => NotificationEntity, (childEntity) => childEntity.device, {
    eager: true,
    nullable: true,
  })
  notifications?: NotificationEntity[] | null;

  @Column({
    nullable: false,
    type: Boolean,
    default: false,
  })
  isActive?: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  model: string;

  @Column({
    nullable: false,
    type: String,
  })
  appVersion: string;

  @Column({
    nullable: true,
    type: String,
  })
  osVersion?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  platform: string;

  @Column({
    nullable: false,
    type: String,
  })
  deviceToken: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
