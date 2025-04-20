import { TenantDto } from '../../tenants/dto/tenant.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';
import { Polygon } from 'geojson';
export class CreateRegionDto {
  @ApiProperty({
    type: [String],
    example: ['00100', '00101'],
    description: 'ZIP codes covered by this region',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  zipCodes?: string[];

  @ApiProperty({
    type: Object,
    example: {
      days: ['mon', 'wed', 'fri'],
      startTime: '08:00',
      endTime: '17:00',
    },
    description: 'Operating hours configuration',
    required: false,
  })
  @IsOptional()
  @IsObject()
  operatingHours?: {
    days: string[];
    startTime: string;
    endTime: string;
  };

  @ApiProperty({
    type: [String],
    example: ['residential', 'commercial'],
    description: 'Service types available in this region',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceTypes?: string[];

  @ApiProperty({
    type: Number,
    example: 36.8219,
    description: 'Longitude of region centroid',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  centroidLon?: number;

  @ApiProperty({
    type: Number,
    example: -1.2921,
    description: 'Latitude of region centroid',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  centroidLat?: number;

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
    description: 'GeoJSON polygon boundary',
  })
  @IsObject()
  boundary: Polygon;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiProperty({
    required: true,
    type: () => TenantDto,
  })
  @ValidateNested()
  @Type(() => TenantDto)
  @IsNotEmptyObject()
  tenant: TenantDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
