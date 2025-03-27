import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Contract } from './contract.entity';
import { User } from './user.entity';

@Entity('human_reviews')
export class HumanReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ['PENDING_REVIEW', 'REVIEWED_CHANGES', 'APPROVED', 'REJECTED'],
    default: 'PENDING_REVIEW'
  })
  status: string;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @ManyToOne(() => Contract, contract => contract.reviews)
  contract: Contract;

  @ManyToOne(() => User, user => user.reviews)
  reviewer: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 