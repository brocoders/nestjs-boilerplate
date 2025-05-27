import { Account } from '../../accounts/domain/account';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  accountType?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  transactionType: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
