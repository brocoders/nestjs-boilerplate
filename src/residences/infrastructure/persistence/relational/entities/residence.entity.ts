import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import { RegionEntity } from '../../../../../regions/infrastructure/persistence/relational/entities/region.entity';

import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { ResidenceType } from '../../../../../utils/enum/residence-type.enum';

@Entity({
  name: 'residence',
})
export class ResidenceEntity extends EntityRelationalHelper {
  @Column({
    type: 'enum',
    enum: ResidenceType,
    default: ResidenceType.OTHER,
  })
  type: ResidenceType;

  @ManyToMany(() => UserEntity, { eager: true, nullable: true })
  @JoinTable()
  occupants?: UserEntity[] | null;

  @ManyToOne(() => RegionEntity, { eager: true, nullable: false })
  region: RegionEntity;

  @ManyToOne(() => TenantEntity, { eager: true, nullable: false })
  tenant: TenantEntity;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isActive: boolean;

  @Column({
    nullable: false,
    type: Number,
  })
  charge: number;

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
