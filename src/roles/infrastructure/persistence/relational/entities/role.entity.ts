import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Role } from '../../../../domain/role';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'role',
})
export class RoleEntity extends EntityRelationalHelper implements Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
