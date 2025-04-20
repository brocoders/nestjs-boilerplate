import { SettingsEntity } from '../../../../../settings/infrastructure/persistence/relational/entities/settings.entity';

import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';

import { TenantTypeEntity } from '../../../../../tenant-types/infrastructure/persistence/relational/entities/tenant-type.entity';

import { KycDetailsEntity } from '../../../../../kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'tenant',
})
export class TenantEntity extends EntityRelationalHelper {
  @OneToMany(() => SettingsEntity, (childEntity) => childEntity.tenant, {
    eager: true,
    nullable: true,
  })
  settings?: SettingsEntity[] | null;

  @Column({
    nullable: true,
    type: String,
  })
  schemaName?: string | null;

  @OneToOne(() => FileEntity, { eager: true, nullable: true })
  @JoinColumn()
  logo?: FileEntity | null;

  @Column({
    nullable: true,
    type: String,
  })
  address?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  primaryPhone?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  primaryEmail?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  name?: string | null;

  @ManyToOne(() => TenantTypeEntity, { eager: true, nullable: true })
  type?: TenantTypeEntity | null;

  @OneToMany(() => KycDetailsEntity, (childEntity) => childEntity.tenant, {
    eager: true,
    nullable: true,
  })
  kycSubmissions?: KycDetailsEntity[] | null;

  @OneToMany(() => UserEntity, (childEntity) => childEntity.tenant, {
    eager: true,
    nullable: true,
  })
  users?: UserEntity[] | null;

  @Column({
    nullable: false,
    type: Boolean,
  })
  isActive?: boolean;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
