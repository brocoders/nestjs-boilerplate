import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MapAreasController } from './areas/map-areas.controller';
import { MapAreasService } from './areas/map-areas.service';
import { MapArea, MapAreaSchema } from './areas/schemas/map-area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: MapArea.name, schema: MapAreaSchema }]),
  ],
  controllers: [MapAreasController],
  providers: [MapAreasService],
  exports: [MapAreasService],
})
export class MapModule {}
