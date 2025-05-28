import { CustomScheduleDto } from '../../common/dto/custom-schedule.dto';
import { PaymentPlan } from '../../payment-plans/domain/payment-plan';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import { PlanStatusEnum } from '../../utils/enum/plan-type.enum';

export class CustomerPlan {
  @ApiProperty({
    type: CustomScheduleDto,
    required: false,
    nullable: true,
  })
  customSchedule?: CustomScheduleDto | null;

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
    enum: PlanStatusEnum,
    enumName: 'PlanStatusEnum',
    nullable: false,
  })
  status: PlanStatusEnum;

  @ApiProperty({
    type: 'object',
    nullable: true,
    description: 'Custom rates map (key-value pairs)',
    example: { rateA: 100, rateB: 150 },
    additionalProperties: { type: 'number' },
  })
  customRates?: Record<string, number> | null;

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
