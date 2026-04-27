import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { PublicSettingsShape } from './domain/setting';

@ApiTags('Settings')
@Controller({ path: 'settings', version: '1' })
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get('public')
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        multi_region_enabled: { type: 'boolean' },
        default_region_code: { type: 'string' },
        default_locale_code: { type: 'string' },
      },
    },
  })
  publicSettings(): Promise<PublicSettingsShape> {
    return this.service.publicSubset();
  }
}
