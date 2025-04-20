import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StandardClause {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  type: string;

  @ApiProperty()
  @Column('text')
  text: string;

  @ApiProperty()
  @Column({ nullable: true })
  jurisdiction?: string;

  @ApiProperty()
  @Column({ nullable: true })
  version?: string;

  @ApiProperty()
  @Column('text', { nullable: true })
  allowedDeviations?: string;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
} 