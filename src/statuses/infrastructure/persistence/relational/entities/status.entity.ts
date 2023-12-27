import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Status } from '../../../../domain/status';

@Entity({
  name: 'status',
})
export class StatusEntity extends EntityRelationalHelper implements Status {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
