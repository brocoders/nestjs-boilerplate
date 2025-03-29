import { OmitType } from '@nestjs/swagger';
import { Device } from '../domain/device';

export class DeviceUserResponseDto extends OmitType(Device, [
  'user',
] as const) {}
