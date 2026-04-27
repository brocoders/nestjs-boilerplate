import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyEntity } from '../../../../currencies/infrastructure/persistence/relational/entities/currency.entity';

const SEED: Array<Pick<CurrencyEntity, 'code' | 'symbol' | 'decimalPlaces'>> = [
  { code: 'USD', symbol: '$', decimalPlaces: 2 },
  { code: 'EUR', symbol: '€', decimalPlaces: 2 },
  { code: 'SAR', symbol: 'ر.س', decimalPlaces: 2 },
  { code: 'AED', symbol: 'د.إ', decimalPlaces: 2 },
  { code: 'EGP', symbol: 'ج.م', decimalPlaces: 2 },
];

@Injectable()
export class CurrencySeedService {
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly repo: Repository<CurrencyEntity>,
  ) {}

  async run(): Promise<void> {
    for (const row of SEED) {
      const exists = await this.repo.findOne({ where: { code: row.code } });
      if (!exists) {
        await this.repo.save(this.repo.create(row));
      }
    }
  }
}
