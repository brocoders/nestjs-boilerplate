import { Injectable } from '@nestjs/common';
import { Currency } from './domain/currency';
import { CurrencyAbstractRepository } from './infrastructure/persistence/currency.abstract.repository';

@Injectable()
export class CurrenciesService {
  constructor(private readonly repo: CurrencyAbstractRepository) {}

  list(): Promise<Currency[]> {
    return this.repo.findAll();
  }

  findByCode(code: string): Promise<Currency | null> {
    return this.repo.findByCode(code);
  }
}
