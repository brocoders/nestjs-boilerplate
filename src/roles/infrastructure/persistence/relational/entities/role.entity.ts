import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper {
  @PrimaryColumn()
  id: number;
  @ManyToOne(() => TenantEntity, (parentEntity) => parentEntity.roles, {
    eager: false,
    nullable: false,
  })
  tenant: TenantEntity;

  @Column()
  name?: string;
}
