import { Inject, Injectable, Logger } from '@nestjs/common';
import { FxRateAbstractRepository } from './infrastructure/persistence/fx-rate.abstract.repository';

export interface FxHttp {
  fetchUsdRates(): Promise<{
    base: string;
    rates: Record<string, string>;
    date: string;
  }>;
}

@Injectable()
export class FxRateFetcherService {
  private readonly log = new Logger(FxRateFetcherService.name);

  constructor(
    private readonly repo: FxRateAbstractRepository,
    @Inject('FX_HTTP') private readonly http: FxHttp,
  ) {}

  async fetchAndStore(): Promise<void> {
    const { base, rates, date } = await this.http.fetchUsdRates();
    for (const [quote, rate] of Object.entries(rates)) {
      await this.repo.upsertDaily({
        base,
        quote,
        rate: String(rate),
        day: date,
        source: 'exchangerate.host',
      });
    }
    this.log.log(`Stored ${Object.keys(rates).length} FX rates for ${date}`);
  }
}
