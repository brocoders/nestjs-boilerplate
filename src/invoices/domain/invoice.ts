import { Exemption } from '../../exemptions/domain/exemption';
import { Discount } from '../../discounts/domain/discount';
import { AccountsReceivable } from '../../accounts-receivables/domain/accounts-receivable';
import { PaymentPlan } from '../../payment-plans/domain/payment-plan';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Invoice {
  @ApiProperty({
    type: () => Exemption,
    nullable: true,
  })
  exemption?: Exemption | null;

  @ApiProperty({
    type: () => Discount,
    nullable: true,
  })
  discount?: Discount | null;

  @ApiProperty({
    type: () => AccountsReceivable,
    nullable: true,
  })
  accountsReceivable?: AccountsReceivable | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  amountDue?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  amountPaid?: number | null;

  @ApiProperty({
    type: () => [PaymentPlan],
    nullable: true,
  })
  plan?: PaymentPlan[] | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  breakdown?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  dueDate?: Date | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  customer?: User | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
