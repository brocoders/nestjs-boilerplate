import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Currency } from './domain/currency';
import { CurrenciesService } from './currencies.service';

@ApiTags('Currencies')
@Controller({ path: 'currencies', version: '1' })
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get()
  @ApiOkResponse({ type: Currency, isArray: true })
  list(): Promise<Currency[]> {
    return this.service.list();
  }
}
