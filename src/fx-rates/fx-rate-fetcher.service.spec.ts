import { Test } from '@nestjs/testing';
import { FxRateFetcherService } from './fx-rate-fetcher.service';
import { FxRateAbstractRepository } from './infrastructure/persistence/fx-rate.abstract.repository';

describe('FxRateFetcherService', () => {
  it('should upsert rates fetched from the API', async () => {
    const repo = { upsertDaily: jest.fn(), findLatest: jest.fn() };
    const fakeFetch = jest.fn().mockResolvedValue({
      base: 'USD',
      rates: { SAR: '3.75', AED: '3.67', EGP: '47.50', EUR: '0.92' },
      date: '2026-04-26',
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        FxRateFetcherService,
        { provide: FxRateAbstractRepository, useValue: repo },
        { provide: 'FX_HTTP', useValue: { fetchUsdRates: fakeFetch } },
      ],
    }).compile();

    const svc = moduleRef.get(FxRateFetcherService);
    await svc.fetchAndStore();

    expect(repo.upsertDaily).toHaveBeenCalledTimes(4);
    expect(repo.upsertDaily).toHaveBeenCalledWith(
      expect.objectContaining({
        base: 'USD',
        quote: 'SAR',
        rate: '3.75',
        day: '2026-04-26',
        source: 'exchangerate.host',
      }),
    );
  });

  it('should pass through non-string rate values as strings', async () => {
    const repo = { upsertDaily: jest.fn(), findLatest: jest.fn() };
    const fakeFetch = jest.fn().mockResolvedValue({
      base: 'USD',
      rates: { SAR: '3.75' } as Record<string, string>,
      date: '2026-04-26',
    });
    const moduleRef = await Test.createTestingModule({
      providers: [
        FxRateFetcherService,
        { provide: FxRateAbstractRepository, useValue: repo },
        { provide: 'FX_HTTP', useValue: { fetchUsdRates: fakeFetch } },
      ],
    }).compile();
    const svc = moduleRef.get(FxRateFetcherService);
    await svc.fetchAndStore();
    expect(repo.upsertDaily).toHaveBeenCalledWith(
      expect.objectContaining({ rate: '3.75' }),
    );
  });
});
