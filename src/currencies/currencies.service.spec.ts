import { Test } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import { CurrencyAbstractRepository } from './infrastructure/persistence/currency.abstract.repository';
import { Currency } from './domain/currency';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repo: jest.Mocked<CurrencyAbstractRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: CurrencyAbstractRepository,
          useValue: { findAll: jest.fn(), findByCode: jest.fn() },
        },
      ],
    }).compile();
    service = moduleRef.get(CurrenciesService);
    repo = moduleRef.get(CurrencyAbstractRepository);
  });

  it('should list all currencies', async () => {
    const sar: Currency = Object.assign(new Currency(), {
      code: 'SAR',
      symbol: 'ر.س',
      decimalPlaces: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.findAll.mockResolvedValue([sar]);
    expect(await service.list()).toEqual([sar]);
  });

  it('should find a currency by code', async () => {
    const usd: Currency = Object.assign(new Currency(), {
      code: 'USD',
      symbol: '$',
      decimalPlaces: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.findByCode.mockResolvedValue(usd);
    expect(await service.findByCode('USD')).toEqual(usd);
  });

  it('should return null when currency code is not found', async () => {
    repo.findByCode.mockResolvedValue(null);
    expect(await service.findByCode('XXX')).toBeNull();
  });
});
