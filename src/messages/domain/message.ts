import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  physicalDeviceId?: string | null;

  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  lastSeen?: Date | null;

  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'UUID used as the message identifier',
  })
  message: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
