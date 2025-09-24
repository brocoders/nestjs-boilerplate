// src/providers/cmc/cmc.controller.ts
import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CmcService } from './cmc.service';
import { AllConfigType } from 'src/config/config.type';
import { ApiTags } from '@nestjs/swagger';

@Controller('cmc')
@ApiTags('CoinMarketCap')
export class CmcController {
  constructor(
    private readonly cmcService: CmcService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  // Health check for quick wiring verification
  @Get('ping')
  ping() {
    return { ok: true, service: 'cmc' };
  }

  // Minimal pass-through endpoints for smoke testing

  // --- Test endpoint: get price of an asset ---------------------------------
  // GET /cmc/test/price?symbol=BTC&convert=USD
  @Get('test/price')
  @HttpCode(HttpStatus.OK)
  async getTestPrice(
    @Query('symbol') symbol?: string,
    @Query('convert') convert?: string,
  ) {
    const fallback = this.configService.get('cmc.defaultFiatCurrency', 'USD', {
      infer: true,
    });
    const fiat = (convert ?? fallback).toUpperCase();

    if (!symbol) {
      return {
        ok: false,
        message: 'symbol query param is required, e.g., ?symbol=BTC',
      };
    }

    const sym = symbol.toUpperCase();
    const result = await this.cmcService.getQuotesLatest({
      symbol: sym,
      convert: fiat,
    });

    // CMC returns: { data: { BTC: { quote: { USD: { price }}}}}
    const price = result?.data?.[sym]?.quote?.[fiat]?.price ?? null;

    return {
      ok: true,
      symbol: sym,
      convert: fiat,
      price,
    };
  }

  // GET /cmc/global-metrics?convert=USD
  @Get('global-metrics')
  async getGlobalMetrics(@Query('convert') convert?: string) {
    const fallback = this.configService.get('cmc.defaultFiatCurrency', 'USD', {
      infer: true,
    });
    return this.cmcService.getGlobalMetrics({ convert: convert ?? fallback });
  }

  // GET /cmc/quotes/latest?symbol=BTC,ETH&convert=USD
  @Get('quotes/latest')
  async getQuotesLatest(
    @Query('symbol') symbol?: string,
    @Query('id') id?: string,
    @Query('slug') slug?: string,
    @Query('convert') convert?: string,
  ) {
    const fallback = this.configService.get('cmc.defaultFiatCurrency', 'USD', {
      infer: true,
    });
    return this.cmcService.getQuotesLatest({
      symbol,
      id,
      slug,
      convert: convert ?? fallback,
    });
  }
  // GET /cmc/key/info - Fetch CMC key info
  @Get('key/info')
  @HttpCode(HttpStatus.OK)
  async getKeyInfo() {
    return await this.cmcService.getKeyInfo();
  }
}
