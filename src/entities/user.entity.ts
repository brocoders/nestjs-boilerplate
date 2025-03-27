import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { HumanReview } from './human-review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['LEGAL_COUNSEL', 'MANAGER', 'APPROVER', 'ADMIN'],
    default: 'LEGAL_COUNSEL'
  })
  role: string;

  @Column({ nullable: true })
  department: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => HumanReview, review => review.reviewer)
  reviews: HumanReview[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 