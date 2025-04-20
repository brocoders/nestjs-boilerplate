import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity({
  name: 'region',
})
export class RegionEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  zipCodes?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  operatingHours?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  serviceTypes?: string | null;

  @Column({
    nullable: true,
    type: Number,
  })
  centroidLon?: number | null;

  @Column({
    nullable: true,
    type: String,
  })
  centroidLat?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  boundary?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  name?: string | null;

  @ManyToOne(() => TenantEntity, (parentEntity) => parentEntity.regions, {
    eager: false,
    nullable: false,
  })
  tenant: TenantEntity;

  @ManyToMany(() => UserEntity, (user) => user.regions)
  users: UserEntity[];

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
