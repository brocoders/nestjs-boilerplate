import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { VendorBillEntity } from '../../../../../vendor-bills/infrastructure/persistence/relational/entities/vendor-bill.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'vendor',
})
export class VendorEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

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
