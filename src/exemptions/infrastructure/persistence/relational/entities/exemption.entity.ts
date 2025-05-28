import { InvoiceEntity } from '../../../../../invoices/infrastructure/persistence/relational/entities/invoice.entity';

import { ResidenceEntity } from '../../../../../residences/infrastructure/persistence/relational/entities/residence.entity';

import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';

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
  name: 'exemption',
})
export class ExemptionEntity extends EntityRelationalHelper {
  @ManyToOne(() => InvoiceEntity, { eager: true, nullable: true })
  invoice?: InvoiceEntity | null;

  @ManyToOne(() => ResidenceEntity, { eager: true, nullable: true })
  residence?: ResidenceEntity | null;

  @ManyToOne(() => RegionEntity, { eager: true, nullable: true })
  region?: RegionEntity | null;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  customer?: UserEntity | null;

  @Column({
    nullable: false,
    type: Date,
  })
  endDate: Date;

  @Column({
    nullable: false,
    type: Date,
  })
  startDate: Date;

  @Column({
    nullable: true,
    type: String,
  })
  reason?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
