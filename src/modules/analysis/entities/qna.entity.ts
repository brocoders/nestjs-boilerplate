import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.entity';
import { Clause } from './clause.entity';

@Entity('qna')
export class QnA {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the Q&A interaction' })
  id: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'User question' })
  question: string;

  @Column({ type: 'text' })
  @ApiProperty({ description: 'AI answer' })
  answer: string;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Whether the answer was accepted by the user' })
  isAccepted: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: 'Whether the answer was flagged as incorrect' })
  isFlagged: boolean;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'User feedback on the answer', required: false })
  feedback: string;

  @ManyToOne(() => Contract, (contract) => contract.qnaInteractions)
  @ApiProperty({ description: 'Contract this Q&A is related to' })
  contract: Contract;

  @ManyToOne(() => Clause, (clause) => clause.qnaInteractions, {
    nullable: true,
  })
  @ApiProperty({
    description: 'Clause this Q&A is related to',
    required: false,
  })
  clause: Clause;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
