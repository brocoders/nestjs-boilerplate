import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'message',
})
export class MessageEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  physicalDeviceId?: string | null;

  @Column({
    nullable: true,
    type: Date,
  })
  lastSeen?: Date | null;

  @Column({
    nullable: false,
    type: String,
  })
  message: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
