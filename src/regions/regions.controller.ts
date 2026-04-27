import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Region } from './domain/region';
import { RegionsService } from './regions.service';

@ApiTags('Regions')
@Controller({ path: 'regions', version: '1' })
export class RegionsController {
  constructor(private readonly service: RegionsService) {}

  @Get()
  @ApiOkResponse({ type: Region, isArray: true })
  list(): Promise<Region[]> {
    return this.service.listEnabled();
  }
}
