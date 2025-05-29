import { Tenant } from '../../tenants/domain/tenant';
import { Invoice } from '../../invoices/domain/invoice';
import { PaymentNotification } from '../../payment-notifications/domain/payment-notification';
import { PaymentMethod } from '../../payment-methods/domain/payment-method';
import { User } from '../../users/domain/user';
import { Transaction } from '../../transactions/domain/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '../../utils/enum/payment-notification.enums';

export class Payment {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: () => Invoice,
    nullable: true,
  })
  invoice?: Invoice | null;

  @ApiProperty({
    type: () => PaymentNotification,
    nullable: true,
  })
  notification?: PaymentNotification | null;

  @ApiProperty({
    type: () => PaymentMethod,
    nullable: true,
  })
  paymentMethod?: PaymentMethod | null;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  customer?: User | null;

  @ApiProperty({
    type: () => [Transaction],
    nullable: true,
  })
  transactionId?: Transaction[] | null;

  @ApiProperty({
    enum: PaymentStatus,
    nullable: false,
  })
  status: PaymentStatus;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  paymentDate: Date;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
