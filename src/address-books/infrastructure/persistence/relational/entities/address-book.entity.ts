import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'address_book',
})
export class AddressBookEntity extends EntityRelationalHelper {
  @ManyToOne(() => UserEntity, { eager: true, nullable: false })
  user: UserEntity;

  @Column({
    type: Boolean,
    nullable: true,
    default: false,
  })
  isFavorite?: boolean | null;

  @Column({
    nullable: true,
    type: String,
  })
  notes?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  memo?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  tag?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  assetType: string;

  @Column({
    nullable: false,
    type: String,
  })
  blockchain: string;

  @Column({
    nullable: false,
    type: String,
  })
  address: string;

  @Column({
    nullable: false,
    type: String,
  })
  label: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
