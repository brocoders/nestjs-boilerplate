import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';

@Entity('summaries')
export class Summary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['FULL', 'RISKS', 'KEY_POINTS', 'OBLIGATIONS']
  })
  summaryType: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Contract, contract => contract.summaries)
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 