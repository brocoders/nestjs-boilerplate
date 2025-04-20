import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Tenant {
  @ApiProperty({
    type: () => [User],
    nullable: true,
  })
  users?: User[] | null;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive?: boolean;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
