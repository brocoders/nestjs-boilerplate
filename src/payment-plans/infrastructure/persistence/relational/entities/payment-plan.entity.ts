import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'payment_plan',
})
export class PaymentPlanEntity extends EntityRelationalHelper {
  @Column({
    nullable: false,
    type: Boolean,
  })
  isActive: boolean;

  @Column({
    nullable: false,
    type: String,
  })
  unit: string;

  @Column({
    nullable: false,
    type: Number,
  })
  minimumCharge: number;

  @Column({
    nullable: true,
    type: String,
  })
  rateStructure?: string | null;

  @Column({
    nullable: true,
    type: String,
  })
  type?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
