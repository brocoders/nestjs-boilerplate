import { Injectable } from '@nestjs/common';
import { FxHttp } from './fx-rate-fetcher.service';

// fawazahmed0/exchange-api — truly free, no API key, jsDelivr-hosted,
// covers every currency including MENA (SAR/AED/EGP).
// Source: https://github.com/fawazahmed0/exchange-api
// Response shape: { date: 'YYYY-MM-DD', usd: { sar: 3.75, aed: 3.67, egp: 47.50, eur: 0.92, ... } }
const FX_API =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const FX_SOURCE = 'fawazahmed0/currency-api';
const FX_QUOTES = ['sar', 'aed', 'egp', 'eur'] as const;

@Injectable()
export class FxHttpClient implements FxHttp {
  async fetchUsdRates(): Promise<{
    base: string;
    rates: Record<string, string>;
    date: string;
    source: string;
  }> {
    const res = await fetch(FX_API);
    if (!res.ok) throw new Error(`FX API ${res.status}`);
    const json = (await res.json()) as {
      date: string;
      usd: Record<string, number>;
    };
    const filtered: Record<string, string> = {};
    for (const code of FX_QUOTES) {
      const v = json.usd[code];
      if (v !== undefined) filtered[code.toUpperCase()] = String(v);
    }
    return {
      base: 'USD',
      rates: filtered,
      date: json.date,
      source: FX_SOURCE,
    };
  }
}
