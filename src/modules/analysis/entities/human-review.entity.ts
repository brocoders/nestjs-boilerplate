import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('human_reviews')
export class HumanReview {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the review' })
  id: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  @ApiProperty({ description: 'Status of the review', enum: ReviewStatus })
  status: ReviewStatus;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Reviewer comments', required: false })
  comments?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Date when the review was started',
    required: false,
  })
  startDate?: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Date when the review was completed',
    required: false,
  })
  completionDate?: Date;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'ID of the user who performed the review',
    required: false,
  })
  reviewerId?: string;

  @ManyToOne(() => Contract, (contract) => contract.reviews)
  @ApiProperty({ description: 'Contract being reviewed' })
  contract: Contract;

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}
