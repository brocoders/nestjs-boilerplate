import { VendorBillEntity } from '../../../../../vendor-bills/infrastructure/persistence/relational/entities/vendor-bill.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'vendor',
})
export class VendorEntity extends EntityRelationalHelper {
  @OneToMany(() => VendorBillEntity, (childEntity) => childEntity.vendor, {
    eager: true,
    nullable: true,
  })
  bills?: VendorBillEntity[] | null;

  @Column({
    nullable: true,
    type: String,
  })
  paymentTerms?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  contactEmail?: string | null;

  @Column({
    nullable: false,
    type: String,
  })
  name: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
