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
  name: 'wallet',
})
export class WalletEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: Boolean,
    default: false,
  })
  active?: boolean | null;

  @Column({
    nullable: true,
    type: String,
  })
  label?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  provider: string;

  @Column({
    nullable: false,
    type: String,
  })
  lockupId: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
