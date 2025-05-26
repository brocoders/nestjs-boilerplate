import { ApiProperty } from '@nestjs/swagger';
import {
  PaymentStatus,
  PaymentMethod,
  Currency,
  PaymentProvider,
} from '../../utils/enum/payment-notification.enums';

export class PaymentNotification {
  @ApiProperty({
    type: Date,
    nullable: true,
  })
  processed_at?: Date | null;

  @ApiProperty({
    type: Boolean,
  })
  processed: boolean;

  @ApiProperty({
    type: Object,
  })
  raw_payload: object;

  @ApiProperty({
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @ApiProperty({
    type: Date,
  })
  received_at: Date;

  @ApiProperty({
    enum: PaymentMethod,
  })
  payment_method: PaymentMethod;

  @ApiProperty({
    enum: Currency,
  })
  currency: Currency;

  @ApiProperty({
    type: Number,
  })
  amount: number;

  @ApiProperty({
    type: String,
  })
  external_txn_id: string;

  @ApiProperty({
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}
