import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('standard_clauses')
export class StandardClause {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  jurisdiction: string;

  @Column({ nullable: true })
  version: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  allowedDeviations: {
    type: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
  }[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 