import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Wallet {
  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  active?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  label?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  provider: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  lockupId: string;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
