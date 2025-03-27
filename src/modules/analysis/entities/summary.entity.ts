import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.entity';
import { Clause } from './clause.entity';

export enum SummaryType {
  FULL = 'FULL',
  CLAUSE = 'CLAUSE',
  RISK = 'RISK',
  COMPLIANCE = 'COMPLIANCE',
}

@Entity('summaries')
export class Summary {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the summary' })
  id: string;

  @Column({
    type: 'enum',
    enum: SummaryType,
  })
  @ApiProperty({ description: 'Type of summary', enum: SummaryType })
  type: SummaryType;

  @Column('text')
  @ApiProperty({ description: 'Summary text content' })
  text: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether the summary has been reviewed' })
  isReviewed: boolean;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Reviewer comments on the summary', required: false })
  reviewerComments?: string;

  @ManyToOne(() => Contract, contract => contract.summaries)
  @ApiProperty({ description: 'Contract this summary belongs to' })
  contract: Contract;

  @ManyToOne(() => Clause, clause => clause.summaries, { nullable: true })
  @ApiProperty({ description: 'Clause this summary is associated with', required: false })
  clause?: Clause;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
} 