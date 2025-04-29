import { ObjectData } from '../../../../../utils/types/object.type';
import { DeviceEntity } from '../../../../../devices/infrastructure/persistence/relational/entities/device.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { NotificationCategory } from '../../../../types/notification-enum.type';

@Entity({
  name: 'notification',
})
export class NotificationEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: String,
    default: NotificationCategory.GENERAL,
  })
  category?: string;

  @Column({
    nullable: false,
    type: Boolean,
    default: false,
  })
  isRead?: boolean;

  @Column({
    nullable: false,
    type: Boolean,
    default: false,
  })
  isDelivered?: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data: ObjectData<any>;

  @Column({
    nullable: false,
    type: String,
  })
  topic?: string;

  @Column({
    nullable: false,
    type: String,
  })
  message: string;

  @Column({
    nullable: false,
    type: String,
  })
  title: string;

  @ManyToOne(() => DeviceEntity, (parentEntity) => parentEntity.notifications, {
    eager: false,
    nullable: false,
  })
  device: DeviceEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
