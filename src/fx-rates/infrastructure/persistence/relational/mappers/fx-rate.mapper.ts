import { FxRate } from '../../../../domain/fx-rate';
import { FxRateEntity } from '../entities/fx-rate.entity';

export class FxRateMapper {
  static toDomain(entity: FxRateEntity): FxRate {
    const d = new FxRate();
    d.id = entity.id;
    d.baseCurrency = entity.baseCurrency;
    d.quoteCurrency = entity.quoteCurrency;
    d.rate = entity.rate;
    d.fetchedDate = entity.fetchedDate;
    d.fetchedAt = entity.fetchedAt;
    d.source = entity.source;
    return d;
  }
}
