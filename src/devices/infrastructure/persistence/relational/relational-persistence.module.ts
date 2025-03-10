import { Module } from '@nestjs/common';
import { DeviceRepository } from '../device.repository';
import { DeviceRelationalRepository } from './repositories/device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceEntity } from './entities/device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  providers: [
    {
      provide: DeviceRepository,
      useClass: DeviceRelationalRepository,
    },
  ],
  exports: [DeviceRepository],
})
export class RelationalDevicePersistenceModule {}
