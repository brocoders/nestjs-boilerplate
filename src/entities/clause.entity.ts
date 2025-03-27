import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Contract } from './contract.entity';
import { RiskFlag } from './risk-flag.entity';

@Entity('clauses')
export class Clause {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  clauseNumber: string;

  @Column({ nullable: true })
  heading: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ nullable: true })
  classification: string;

  @Column({
    type: 'enum',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    nullable: true
  })
  riskLevel: string;

  @ManyToOne(() => Contract, contract => contract.clauses)
  contract: Contract;

  @OneToMany(() => RiskFlag, riskFlag => riskFlag.clause)
  riskFlags: RiskFlag[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 