import { PaymentPlan } from '../../payment-plans/domain/payment-plan';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerPlan {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  customSchedule?: string | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  nextPaymentDate?: Date | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  assignedBy?: User | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  customRates?: string | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  endDate?: Date | null;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  startDate: Date;

  @ApiProperty({
    type: () => [PaymentPlan],
    nullable: false,
  })
  plan: PaymentPlan[];

  @ApiProperty({
    type: () => [User],
    nullable: false,
  })
  customer: User[];

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
