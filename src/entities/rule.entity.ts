import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('rules')
export class Rule {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  pattern?: string;

  @ApiProperty({ required: false, type: Number })
  @Column({ type: 'float', nullable: true })
  similarityThreshold?: number;

  @ApiProperty({ required: false, type: Number })
  @Column({ type: 'float', nullable: true })
  deviationAllowedPct?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
