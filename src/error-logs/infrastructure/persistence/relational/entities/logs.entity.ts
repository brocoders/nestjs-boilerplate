import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Logs } from '@/error-logs/domain/logs';

@Entity({
  name: 'logs',
})
export class LogsEntity extends EntityRelationalHelper implements Logs {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'text' })
  path: string;

  @Column({ type: 'json' })
  message: JSON;

  @Column({ type: 'json' })
  stack: JSON;
  
  @Column({ type: 'text' })
  method: string;
  
  @Column({ type: 'json', nullable: true })
  payload?: JSON | null;
  
  @Column({ type: 'integer' })
  status: number;

  @CreateDateColumn()
  timestamp: Date;
}
