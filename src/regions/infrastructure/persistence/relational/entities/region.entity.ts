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
import { Polygon } from 'geojson';
@Entity({
  name: 'region',
})
export class RegionEntity extends EntityRelationalHelper {
  @Column({ type: 'text', array: true, nullable: true })
  zipCodes?: string[];

  @Column({ type: 'jsonb', nullable: true })
  operatingHours?: {
    days?: string[];
    startTime?: string;
    endTime?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  serviceTypes?: string[]; // ['residential', 'commercial', 'industrial']

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  centroidLat?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  centroidLon?: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Polygon',
    srid: 4326,
    nullable: true,
  })
  boundary?: Polygon;

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
