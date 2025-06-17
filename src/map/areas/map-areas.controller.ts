import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MapAreasService } from './map-areas.service';
import { MapAreasFilterDto } from './dto/map-areas-filter.dto';
import { MapAreaResponseDto } from './dto/map-area-response.dto';

@ApiTags('Map')
@Controller({
  path: 'map/areas',
  version: '1',
})
export class MapAreasController {
  constructor(private readonly mapAreasService: MapAreasService) {}

  @ApiOperation({ summary: 'Get map areas with filters' })
  @ApiResponse({
    status: 200,
    description: 'Returns filtered map areas',
    type: MapAreaResponseDto,
  })
  @Get()
  async getAreas(
    @Query() filters: MapAreasFilterDto,
  ): Promise<MapAreaResponseDto> {
    return this.mapAreasService.getAreas(filters);
  }
}
