import { Tenant } from '../../tenants/domain/tenant';
import { ApiProperty } from '@nestjs/swagger';
import { Polygon } from 'geojson';
export class Region {
  @ApiProperty({
    type: [String],
    example: ['00100', '00101'],
    description: 'ZIP codes covered by this region',
  })
  zipCodes?: string[];

  @ApiProperty({
    type: Object,
    example: {
      days: ['mon', 'wed', 'fri'],
      startTime: '08:00',
      endTime: '17:00',
    },
    description: 'Operating hours for waste collection',
  })
  operatingHours?: {
    days?: string[];
    startTime?: string;
    endTime?: string;
  };

  @ApiProperty({
    type: [String],
    example: ['residential', 'commercial'],
    description: 'Supported service types in this region',
  })
  serviceTypes?: string[];

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  centroidLon?: number | null;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  centroidLat?: number | null;

  @ApiProperty({
    type: Object,
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [36.8219, -1.2921],
          [36.895, -1.2921],
          [36.895, -1.2335],
          [36.8219, -1.2335],
          [36.8219, -1.2921],
        ],
      ],
    },
    description: 'GeoJSON polygon defining region boundaries',
  })
  boundary?: Polygon;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  name?: string | null;

  @ApiProperty({
    type: () => Tenant,
    nullable: false,
  })
  tenant: Tenant;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
