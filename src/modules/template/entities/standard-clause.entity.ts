import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { SeverityLevel } from '../dto/create-standard-clause.dto';

@Entity('standard_clauses')
export class StandardClause {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier of the standard clause' })
  id: string;

  @Column()
  @ApiProperty({ description: 'Name of the standard clause' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Type of the standard clause' })
  type: string;

  @Column('text')
  @ApiProperty({ description: 'Text content of the standard clause' })
  text: string;

  @Column()
  @ApiProperty({ description: 'Jurisdiction this clause applies to' })
  jurisdiction: string;

  @Column()
  @ApiProperty({ description: 'Version of the standard clause' })
  version: string;

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Description of the standard clause', required: false })
  description?: string;

  @Column('jsonb', { nullable: true })
  @ApiProperty({ description: 'Allowed deviations from the standard clause', required: false })
  allowedDeviations?: {
    type: string;
    description: string;
    severity: SeverityLevel;
  }[];

  @Column({ default: true })
  @ApiProperty({ description: 'Whether the clause is active' })
  isActive: boolean;

  @Column({ default: false })
  @ApiProperty({ description: 'Whether this is the latest version' })
  isLatest: boolean;

  @ManyToOne(() => StandardClause, { nullable: true })
  @ApiProperty({ description: 'Previous version of this clause', required: false })
  previousVersion?: StandardClause;

  @OneToMany(() => StandardClause, clause => clause.previousVersion)
  @ApiProperty({ description: 'Next versions of this clause' })
  nextVersions: StandardClause[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
} 