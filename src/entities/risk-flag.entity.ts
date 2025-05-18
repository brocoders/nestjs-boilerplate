import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { Clause } from './clause.entity';

export enum RiskFlagStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  IGNORED = 'ignored',
}

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

  /**
   * Tracks the current state of the risk flag. Use this field for all logic regarding resolution status.
   * Possible values: 'open', 'resolved', 'ignored'.
   * The isResolved boolean was removed to avoid redundant state tracking.
   */
  @Column({
    type: 'enum',
    enum: Object.values(RiskFlagStatus),
    default: RiskFlagStatus.OPEN,
  })
  status: RiskFlagStatus;

  /**
   * @deprecated Use the status field instead. This field is kept for backward compatibility.
   * Its value should be synchronized with status in the service layer.
   * Do not use isResolved directly in new logic.
   */
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