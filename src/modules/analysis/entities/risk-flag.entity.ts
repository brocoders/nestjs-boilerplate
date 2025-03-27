import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.entity';
import { Clause } from './clause.entity';

export enum RiskSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum RiskType {
  MISSING_CLAUSE = 'MISSING_CLAUSE',
  DEVIATION = 'DEVIATION',
  COMPLIANCE_ISSUE = 'COMPLIANCE_ISSUE',
  AMBIGUOUS_LANGUAGE = 'AMBIGUOUS_LANGUAGE',
  UNFAIR_TERMS = 'UNFAIR_TERMS',
  DATA_PROTECTION = 'DATA_PROTECTION',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  LIABILITY = 'LIABILITY',
  TERMINATION = 'TERMINATION',
  OTHER = 'OTHER',
}

@Entity('risk_flags')
export class RiskFlag {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the risk flag' })
  id: string;

  @Column({
    type: 'enum',
    enum: RiskType,
  })
  @ApiProperty({ description: 'Type of risk', enum: RiskType })
  type: RiskType;

  @Column({
    type: 'enum',
    enum: RiskSeverity,
  })
  @ApiProperty({ description: 'Severity level of the risk', enum: RiskSeverity })
  severity: RiskSeverity;

  @Column('text')
  @ApiProperty({ description: 'Description of the risk' })
  description: string;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Suggested resolution for the risk', required: false })
  suggestedResolution: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the risk has been reviewed' })
  isReviewed: boolean;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the risk has been resolved' })
  isResolved: boolean;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Reviewer comments on the risk', required: false })
  reviewerComments: string;

  @ManyToOne(() => Contract, contract => contract.riskFlags)
  @ApiProperty({ description: 'Contract this risk flag belongs to' })
  contract: Contract;

  @ManyToOne(() => Clause, clause => clause.riskFlags, { nullable: true })
  @ApiProperty({ description: 'Clause this risk flag is associated with', required: false })
  clause: Clause;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
} 