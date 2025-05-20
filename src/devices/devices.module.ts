import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { RelationalDevicePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { forwardRef, Module } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => NotificationsModule),

    UsersModule,
    // import modules, etc.
    RelationalDevicePersistenceModule,
  ],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService, RelationalDevicePersistenceModule],
})
export class DevicesModule {}
