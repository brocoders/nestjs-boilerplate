import { IsOptional, IsEnum } from 'class-validator';
import { Account } from '../../accounts/domain/account';
import { User } from '../../users/domain/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../utils/enum/account-type.enum';

export class AccountsReceivable {
  @ApiProperty({
    type: () => [Account],
    nullable: true,
  })
  account?: Account[] | null;

  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  owner?: User[] | null;

  @ApiPropertyOptional({
    enum: AccountTypeEnum,
    description: 'The type of account. Can be SAVINGS, CHECKING, or CURRENT.',
    nullable: true,
  })
  @IsOptional()
  @IsEnum(AccountTypeEnum)
  accountType?: AccountTypeEnum | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    enum: TransactionTypeEnum,
    required: true,
    description: 'The type of transaction: CREDIT, DEBIT, TRANSFER, or REFUND.',
  })
  @IsEnum(TransactionTypeEnum)
  transactionType: TransactionTypeEnum;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
