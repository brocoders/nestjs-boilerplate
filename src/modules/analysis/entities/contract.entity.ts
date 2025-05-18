import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Clause } from './clause.entity';
import { RiskFlag } from './risk-flag.entity';
import { Summary } from './summary.entity';
import { QnA } from './qna.entity';
import { HumanReview } from './human-review.entity';

export enum ContractStatus {
  PENDING_REVIEW = 'pending_review',
  IN_REVIEW = 'in_review',
  REVIEWED = 'reviewed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ContractType {
  NDA = 'nda',
  EMPLOYMENT = 'employment',
  VENDOR = 'vendor',
  SAAS = 'saas',
  SALES = 'sales',
  OTHER = 'other',
}

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the contract' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Title or filename of the contract' })
  title: string;

  @Column({
    type: 'enum',
    enum: ContractType,
    default: ContractType.OTHER,
  })
  @ApiProperty({ description: 'Type of the contract', enum: ContractType })
  type: ContractType;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.PENDING_REVIEW,
  })
  @ApiProperty({
    description: 'Current status of the contract',
    enum: ContractStatus,
  })
  status: ContractStatus;

  @Column('text', { nullable: true })
  @ApiProperty({
    description: 'Original text content of the contract',
    required: false,
  })
  originalText?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Governing law of the contract',
    required: false,
  })
  governingLaw?: string;

  @Column('jsonb', { nullable: true })
  @ApiProperty({
    description: 'Parties involved in the contract',
    required: false,
  })
  parties?: {
    name: string;
    role: string;
    type: 'individual' | 'organization';
  }[];

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Date when the contract was uploaded',
    required: false,
  })
  uploadDate?: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Date when the contract review was completed',
    required: false,
  })
  reviewCompletionDate?: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Language of the contract', required: false })
  language?: string;

  @OneToMany(() => Clause, (clause) => clause.contract)
  @ApiProperty({ description: 'Clauses in the contract' })
  clauses: Clause[];

  @OneToMany(() => RiskFlag, (riskFlag) => riskFlag.contract)
  @ApiProperty({ description: 'Risk flags identified in the contract' })
  riskFlags: RiskFlag[];

  @OneToMany(() => Summary, (summary) => summary.contract)
  @ApiProperty({ description: 'Summaries generated for the contract' })
  summaries: Summary[];

  @OneToMany(() => QnA, (qna) => qna.contract)
  @ApiProperty({ description: 'Q&A interactions related to the contract' })
  qnaInteractions: QnA[];

  @OneToMany(() => HumanReview, (review) => review.contract)
  @ApiProperty({ description: 'Human reviews of the contract' })
  reviews: HumanReview[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
