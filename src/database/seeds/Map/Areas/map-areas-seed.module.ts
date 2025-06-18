import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapAreasSeedService } from './map-areas.seed';
import {
  MapArea,
  MapAreaSchema,
} from '../../../../map/areas/schemas/map-area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MapArea.name,
        schema: MapAreaSchema,
      },
    ]),
  ],
  providers: [MapAreasSeedService],
  exports: [MapAreasSeedService],
})
export class MapAreasSeedModule {}
