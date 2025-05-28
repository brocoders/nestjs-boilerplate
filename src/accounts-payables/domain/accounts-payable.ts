import { Tenant } from '../../tenants/domain/tenant';
import { IsOptional, IsEnum } from 'class-validator';
import { Account } from '../../accounts/domain/account';
import { User } from '../../users/domain/user';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AccountTypeEnum,
  TransactionTypeEnum,
} from '../../utils/enum/account-type.enum';

export class AccountsPayable {
  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

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
    nullable: true,
  })
  salePrice?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  purchasePrice?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  quantity: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  itemDescription?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  itemName: string;

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
