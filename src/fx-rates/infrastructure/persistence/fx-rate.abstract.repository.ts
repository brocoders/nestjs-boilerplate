import { FxRate } from '../../domain/fx-rate';

export abstract class FxRateAbstractRepository {
  abstract upsertDaily(record: {
    base: string;
    quote: string;
    rate: string;
    day: string;
    source: string;
  }): Promise<void>;
  abstract findLatest(base: string, quote: string): Promise<FxRate | null>;
}
