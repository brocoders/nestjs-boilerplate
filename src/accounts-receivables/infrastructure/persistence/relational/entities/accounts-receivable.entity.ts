import { AccountEntity } from '../../../../../accounts/infrastructure/persistence/relational/entities/account.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'accounts_receivable',
})
export class AccountsReceivableEntity extends EntityRelationalHelper {
  @ManyToMany(() => AccountEntity, { eager: true, nullable: true })
  @JoinTable()
  account?: AccountEntity[] | null;

  @ManyToMany(() => UserEntity, { eager: true, nullable: true })
  @JoinTable()
  owner?: UserEntity[] | null;

  @Column({
    nullable: true,
    type: String,
  })
  accountType?: string | null;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @Column({
    nullable: false,
    type: String,
  })
  transactionType: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
