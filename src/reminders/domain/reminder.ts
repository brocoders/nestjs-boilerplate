import { User } from '../../users/domain/user';
import { Invoice } from '../../invoices/domain/invoice';
import { ApiProperty } from '@nestjs/swagger';

export class Reminder {
  @ApiProperty({
    type: () => User,
    nullable: true,
  })
  user?: User | null;

  @ApiProperty({
    type: () => Invoice,
    nullable: true,
  })
  invoice?: Invoice | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  channel?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  status?: string | null;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  scheduledAt: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  sentAt?: Date | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
