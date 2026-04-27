import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Locale } from './domain/locale';
import { LocalesService } from './locales.service';

@ApiTags('Locales')
@Controller({ path: 'locales', version: '1' })
export class LocalesController {
  constructor(private readonly service: LocalesService) {}

  @Get()
  @ApiOkResponse({ type: Locale, isArray: true })
  list(): Promise<Locale[]> {
    return this.service.listEnabled();
  }
}
