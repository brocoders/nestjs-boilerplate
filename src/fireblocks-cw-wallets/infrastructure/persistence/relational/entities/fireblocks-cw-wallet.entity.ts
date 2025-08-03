import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'fireblocks_cw_wallet',
})
export class FireblocksCwWalletEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  assets?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  metadata?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  vaultType?: string;

  @Column({
    nullable: false,
    type: Boolean,
  })
  autoFuel?: boolean;

  @Column({
    nullable: false,
    type: Boolean,
  })
  hiddenOnUI?: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @Column({
    nullable: false,
    type: String,
  })
  referenceId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
