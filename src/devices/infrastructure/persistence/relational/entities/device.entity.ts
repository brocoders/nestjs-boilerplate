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

@Entity({
  name: 'device',
})
export class DeviceEntity extends EntityRelationalHelper {
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
