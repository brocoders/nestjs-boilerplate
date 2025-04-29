import { NotificationCategory } from '../types/notification-enum.type';
import { ObjectData } from '../../utils/types/object.type';
import { Device } from '../../devices/domain/device';
import { ApiProperty } from '@nestjs/swagger';

export class Notification {
  @ApiProperty({
    enum: NotificationCategory,
    default: NotificationCategory.GENERAL,
    nullable: false,
  })
  category?: string = NotificationCategory.GENERAL;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    default: false,
  })
  isRead?: boolean = false;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    default: false,
  })
  isDelivered?: boolean = false;

  @ApiProperty({
    type: Object,
    nullable: true,
  })
  data: ObjectData<any>;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  topic?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  message: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: () => Device,
    nullable: false,
  })
  device: Device;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
