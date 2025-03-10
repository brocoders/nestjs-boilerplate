import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { RelationalDevicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // import modules, etc.
    RelationalDevicePersistenceModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService, RelationalDevicePersistenceModule],
})
export class DevicesModule {}
