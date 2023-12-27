import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Role } from '../../../../domain/role';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper implements Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
