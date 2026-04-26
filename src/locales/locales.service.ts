import { Injectable } from '@nestjs/common';
import { Locale } from './domain/locale';
import { LocaleAbstractRepository } from './infrastructure/persistence/locale.abstract.repository';

@Injectable()
export class LocalesService {
  constructor(private readonly repo: LocaleAbstractRepository) {}

  listEnabled(): Promise<Locale[]> {
    return this.repo.findAllEnabled();
  }

  findByCode(code: string): Promise<Locale | null> {
    return this.repo.findByCode(code);
  }
}
