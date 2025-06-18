import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MapAreaDocument = MapArea & Document;

@Schema({ timestamps: true, collection: 'areas' })
export class MapArea {
  @Prop({ required: true })
  type: string;

  @Prop({
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon', 'Point', 'LineString'],
      required: true,
    },
    coordinates: {
      type: MongooseSchema.Types.Mixed,
      required: true,
    },
  })
  geometry: {
    type: 'Polygon' | 'MultiPolygon' | 'Point' | 'LineString';
    coordinates: any;
  };

  @Prop({ type: MongooseSchema.Types.Mixed })
  properties: any;
}

export const MapAreaSchema = SchemaFactory.createForClass(MapArea);

// Add geospatial index for efficient spatial queries
MapAreaSchema.index({ geometry: '2dsphere' });
