import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Passphrase {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  location: string;

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
