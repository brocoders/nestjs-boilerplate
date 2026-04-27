import { Locale } from '../../domain/locale';

export abstract class LocaleAbstractRepository {
  abstract findAllEnabled(): Promise<Locale[]>;
  abstract findByCode(code: string): Promise<Locale | null>;
  abstract findById(id: string): Promise<Locale | null>;
}
