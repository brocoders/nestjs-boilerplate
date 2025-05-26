import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'tenant_config',
})
export class TenantConfigEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: 'jsonb',
  })
  value: any;

  @Column({
    nullable: false,
    type: String,
  })
  key: string;

  @Column({
    nullable: false,
    type: String,
  })
  tenantId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
