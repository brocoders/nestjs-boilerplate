import { Currency } from '../../../../domain/currency';
import { CurrencyEntity } from '../entities/currency.entity';

export class CurrencyMapper {
  static toDomain(entity: CurrencyEntity): Currency {
    const d = new Currency();
    d.code = entity.code;
    d.symbol = entity.symbol;
    d.decimalPlaces = entity.decimalPlaces;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
