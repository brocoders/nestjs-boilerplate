import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';

import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'kyc_details',
})
export class KycDetailsEntity extends EntityRelationalHelper {
  @ManyToOne(
    () => TenantEntity,
    (parentEntity) => parentEntity.kycSubmissions,
    { eager: false, nullable: false },
  )
  tenant: TenantEntity;

  @ManyToOne(() => UserEntity, (parentEntity) => parentEntity.kycSubmissions, {
    eager: false,
    nullable: false,
  })
  user: UserEntity;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
