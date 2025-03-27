import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Clause } from './clause.entity';
import { RiskFlag } from './risk-flag.entity';
import { Summary } from './summary.entity';
import { QnA } from './qna.entity';
import { HumanReview } from './human-review.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  filename: string;

  @Column()
  contractType: string;

  @Column({ type: 'text', nullable: true })
  fullText: string;

  @Column({ nullable: true })
  governingLaw: string;

  @Column({ nullable: true })
  parties: string;

  @Column({
    type: 'enum',
    enum: ['DRAFT', 'IN_REVIEW', 'REVIEWED', 'APPROVED', 'REJECTED'],
    default: 'DRAFT'
  })
  status: string;

  @Column({ nullable: true })
  language: string;

  @OneToMany(() => Clause, clause => clause.contract)
  clauses: Clause[];

  @OneToMany(() => RiskFlag, riskFlag => riskFlag.contract)
  riskFlags: RiskFlag[];

  @OneToMany(() => Summary, summary => summary.contract)
  summaries: Summary[];

  @OneToMany(() => QnA, qna => qna.contract)
  qnas: QnA[];

  @OneToMany(() => HumanReview, review => review.contract)
  reviews: HumanReview[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 