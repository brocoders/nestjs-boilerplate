import { Injectable } from '@nestjs/common';
import { FxHttp } from './fx-rate-fetcher.service';

const FX_API =
  'https://api.exchangerate.host/latest?base=USD&symbols=SAR,AED,EGP,EUR';

@Injectable()
export class FxHttpClient implements FxHttp {
  async fetchUsdRates(): Promise<{
    base: string;
    rates: Record<string, string>;
    date: string;
  }> {
    const res = await fetch(FX_API);
    if (!res.ok) throw new Error(`FX API ${res.status}`);
    const json = (await res.json()) as {
      base: string;
      date: string;
      rates: Record<string, number>;
    };
    const ratesAsString = Object.fromEntries(
      Object.entries(json.rates).map(([k, v]) => [k, String(v)]),
    );
    return { base: json.base, rates: ratesAsString, date: json.date };
  }
}
