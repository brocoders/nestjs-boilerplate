import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Invoice {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  breakdown?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  dueDate?: Date | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  customer?: User | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
