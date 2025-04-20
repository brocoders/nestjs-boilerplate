import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, (parentEntity) => parentEntity.roles, {
    eager: false,
    nullable: false,
  })
  tenant: TenantEntity;

  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
