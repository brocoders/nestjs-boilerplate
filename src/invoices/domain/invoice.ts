import { Tenant } from '../../tenants/domain/tenant';
import { Exemption } from '../../exemptions/domain/exemption';
import { Discount } from '../../discounts/domain/discount';
import { AccountsReceivable } from '../../accounts-receivables/domain/accounts-receivable';
import { PaymentPlan } from '../../payment-plans/domain/payment-plan';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';
import {
  Breakdown,
  InvoiceStatus,
} from '../infrastructure/persistence/relational/entities/invoice.entity';
import { IsEnum } from 'class-validator';

export class Invoice {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

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
    description: 'Payment breakdown structure',
    type: Object,
    example: {
      baseAmount: { type: 'number', example: 100.0 },
      discounts: { type: 'number', example: 10.0 },
      tax: { type: 'number', example: 18.0 },
      adjustments: { type: 'number', example: 5.0 },
    },
    required: false,
    nullable: true,
  })
  breakdown?: Breakdown | null;
  @ApiProperty({
    enum: InvoiceStatus,
    required: true,
  })
  @IsEnum(InvoiceStatus)
  status: InvoiceStatus;

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
