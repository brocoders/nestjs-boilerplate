import { Controller, Post, Get, Delete, Body } from '@nestjs/common';
import { MapAreasSeedService } from './map-areas.seed';

@Controller('map-areas/seed')
export class MapAreasSeedController {
  constructor(private readonly seedService: MapAreasSeedService) {}

  @Post('from-file')
  async seedFromFile(@Body() body: { filePath: string }) {
    return this.seedService.seedFromFile(body.filePath);
  }

  @Post('from-directory')
  async seedFromDirectory(@Body() body: { directoryPath: string }) {
    return this.seedService.seedFromDirectory(body.directoryPath);
  }

  @Get('stats')
  async getStats() {
    return this.seedService.getCollectionStats();
  }

  @Delete('clear')
  async clearCollection() {
    return this.seedService.clearCollection();
  }
}
