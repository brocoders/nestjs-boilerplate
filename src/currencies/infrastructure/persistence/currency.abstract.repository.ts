import { Currency } from '../../domain/currency';

export abstract class CurrencyAbstractRepository {
  abstract findAll(): Promise<Currency[]>;
  abstract findByCode(code: string): Promise<Currency | null>;
}
