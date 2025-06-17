import { TenantEntity } from '../../../../../tenants/infrastructure/persistence/relational/entities/tenant.entity';

import {
  // typeorm decorators here
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({ name: 'file' })
export class FileEntity extends EntityRelationalHelper {
  @ManyToOne(() => TenantEntity, { eager: true, nullable: true })
  tenant?: TenantEntity | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;
}
