import { Module } from '@nestjs/common';
import { GorushService } from './gorush.service';
import { GorushController } from './gorush.controller';
import { EnableGuard } from 'src/common/guards/service-enabled.guard';
import { ProvidersModule } from '../providers.module';

@Module({
  imports: [ProvidersModule],
  providers: [GorushService, EnableGuard],
  controllers: [GorushController],
})
export class GorushModule {}
