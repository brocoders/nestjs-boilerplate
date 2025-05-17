import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { Clause } from './clause.entity';

@Entity('risk_flags')
export class RiskFlag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['MISSING_CLAUSE', 'DEVIATION', 'COMPLIANCE_ISSUE', 'AMBIGUOUS_LANGUAGE', 'OTHER']
  })
  flagType: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM'
  })
  severity: string;

  @Column({ type: 'text', nullable: true })
  suggestedText: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ enum: ['open', 'resolved', 'ignored'], default: 'open', type: 'enum' })
  status: 'open' | 'resolved' | 'ignored';

  @Column({ default: false })
  isResolved: boolean;

  @ManyToOne(() => Contract, contract => contract.riskFlags)
  contract: Contract;

  @ManyToOne(() => Clause, clause => clause.riskFlags, { nullable: true })
  clause: Clause;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 