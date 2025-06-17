import { Module } from '@nestjs/common';
import { MapAreasController } from './areas/map-areas.controller';
import { MapAreasService } from './areas/map-areas.service';

@Module({
  controllers: [MapAreasController],
  providers: [MapAreasService],
  exports: [MapAreasService],
})
export class MapModule {}
