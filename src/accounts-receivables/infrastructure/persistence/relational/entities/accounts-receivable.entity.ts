import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

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
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../../../../utils/enum/account-type.enum';

@Entity({
  name: 'accounts_receivable',
})
export class AccountsReceivableEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { /**eager: true,**/ nullable: false })
  tenant: TenantEntity;

  @ManyToMany(() => AccountEntity, { /**eager: true,**/ nullable: true })
  @JoinTable()
  account?: AccountEntity[] | null;

  @ManyToMany(() => UserEntity, { /**eager: true,**/ nullable: true })
  @JoinTable()
  owner?: UserEntity[] | null;

  @Column({
    type: 'enum',
    enum: AccountTypeEnum,
  })
  accountType?: AccountTypeEnum | null;

  @Column({
    nullable: false,
    type: Number,
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
    nullable: false,
  })
  transactionType: TransactionTypeEnum;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
