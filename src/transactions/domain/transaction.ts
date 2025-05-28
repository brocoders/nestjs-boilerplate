import { Payment } from '../../payments/domain/payment';
import { Account } from '../../accounts/domain/account';
import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({
    type: () => Payment,
    nullable: false,
  })
  payment: Payment;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  creditAccountName?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  debitAccountName?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  creditAmount: number;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  debitAmount: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  owner?: string | null;

  @ApiProperty({
    type: () => [Account],
    nullable: false,
  })
  creditAccount: Account[];

  @ApiProperty({
    type: () => [Account],
    nullable: false,
  })
  debitAccount: Account[];

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  description?: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
