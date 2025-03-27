import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.entity';
import { RiskFlag } from './risk-flag.entity';
import { Summary } from './summary.entity';
import { QnA } from './qna.entity';

export enum ClauseType {
  TERMINATION = 'TERMINATION',
  CONFIDENTIALITY = 'CONFIDENTIALITY',
  INDEMNIFICATION = 'INDEMNIFICATION',
  LIABILITY = 'LIABILITY',
  INTELLECTUAL_PROPERTY = 'INTELLECTUAL_PROPERTY',
  GOVERNING_LAW = 'GOVERNING_LAW',
  DISPUTE_RESOLUTION = 'DISPUTE_RESOLUTION',
  FORCE_MAJEURE = 'FORCE_MAJEURE',
  ASSIGNMENT = 'ASSIGNMENT',
  NOTICES = 'NOTICES',
  SEVERABILITY = 'SEVERABILITY',
  ENTIRE_AGREEMENT = 'ENTIRE_AGREEMENT',
  AMENDMENT = 'AMENDMENT',
  WAIVER = 'WAIVER',
  COUNTERPARTS = 'COUNTERPARTS',
  HEADINGS = 'HEADINGS',
  DEFINITIONS = 'DEFINITIONS',
  OTHER = 'OTHER',
}

@Entity('clauses')
export class Clause {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the clause' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Number or heading of the clause' })
  number: string;

  @Column('text')
  @ApiProperty({ description: 'Text content of the clause' })
  text: string;

  @Column({
    type: 'enum',
    enum: ClauseType,
    nullable: true,
  })
  @ApiProperty({ description: 'Type of the clause', enum: ClauseType })
  type: ClauseType;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the clause has been reviewed' })
  isReviewed: boolean;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the clause has been approved' })
  isApproved: boolean;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Suggested text for the clause', required: false })
  suggestedText?: string;

  @ManyToOne(() => Contract, contract => contract.clauses)
  @ApiProperty({ description: 'Contract this clause belongs to' })
  contract: Contract;

  @OneToMany(() => RiskFlag, riskFlag => riskFlag.clause)
  @ApiProperty({ description: 'Risk flags identified in this clause' })
  riskFlags: RiskFlag[];

  @OneToMany(() => Summary, summary => summary.clause)
  @ApiProperty({ description: 'Summaries generated for this clause' })
  summaries: Summary[];

  @OneToMany(() => QnA, qna => qna.clause)
  @ApiProperty({ description: 'Q&A interactions related to this clause' })
  qnaInteractions: QnA[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
} 