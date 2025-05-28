import { AccountsPayableEntity } from '../../../../../accounts-payables/infrastructure/persistence/relational/entities/accounts-payable.entity';

import { VendorEntity } from '../../../../../vendors/infrastructure/persistence/relational/entities/vendor.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'vendor_bill',
})
export class VendorBillEntity extends EntityRelationalHelper {
  @OneToOne(() => AccountsPayableEntity, { eager: true, nullable: true })
  @JoinColumn()
  accountsPayable?: AccountsPayableEntity | null;

  @ManyToOne(() => VendorEntity, (parentEntity) => parentEntity.bills, {
    eager: false,
    nullable: false,
  })
  vendor: VendorEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
