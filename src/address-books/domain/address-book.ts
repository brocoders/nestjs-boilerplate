import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class AddressBook {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  user: User;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    default: false,
  })
  isFavorite?: boolean | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  notes?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  memo?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  tag?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  assetType: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  blockchain: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  address: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  label: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
