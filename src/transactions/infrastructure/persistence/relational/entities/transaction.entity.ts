import { AccountEntity } from '../../../../../accounts/infrastructure/persistence/relational/entities/account.entity';

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
  name: 'transaction',
})
export class TransactionEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  creditAccountName?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  debitAccountName?: string | null;

  @Column({
    nullable: false,
    type: Number,
  })
  creditAmount: number;

  @Column({
    nullable: false,
    type: Number,
  })
  debitAmount: number;

  @Column({
    nullable: true,
    type: String,
  })
  owner?: string | null;

  @ManyToMany(() => AccountEntity, { eager: true, nullable: false })
  @JoinTable()
  creditAccount: AccountEntity[];

  @ManyToMany(() => AccountEntity, { eager: true, nullable: false })
  @JoinTable()
  debitAccount: AccountEntity[];

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @Column({
    nullable: false,
    type: String,
  })
  description?: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
