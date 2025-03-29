import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Device {
  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isActive?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  model: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  appVersion: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  osVersion?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  platform: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  deviceToken: string;

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
