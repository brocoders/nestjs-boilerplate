import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Contract } from './contract.entity';

@Entity('qnas')
export class QnA {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ default: false })
  isAccepted: boolean;

  @Column({ nullable: true })
  feedback: string;

  @ManyToOne(() => Contract, (contract) => contract.qnas)
  contract: Contract;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
