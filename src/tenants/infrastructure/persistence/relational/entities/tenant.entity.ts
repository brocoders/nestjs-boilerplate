import { KycDetailsEntity } from '../../../../../kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

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
  name: 'tenant',
})
export class TenantEntity extends EntityRelationalHelper {
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
