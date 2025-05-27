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
  name: 'invoice',
})
export class InvoiceEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  breakdown?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  status: string;

  @Column({
    nullable: true,
    type: Date,
  })
  dueDate?: Date | null;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  customer?: UserEntity | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
