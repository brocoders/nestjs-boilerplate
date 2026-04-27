import { Injectable } from '@nestjs/common';
import { PublicSettingsShape, SettingsShape } from './domain/setting';
import { SettingAbstractRepository } from './infrastructure/persistence/setting.abstract.repository';

@Injectable()
export class SettingsService {
  constructor(private readonly repo: SettingAbstractRepository) {}

  get(): Promise<SettingsShape> {
    return this.repo.get();
  }

  async getValue<K extends keyof SettingsShape>(
    key: K,
  ): Promise<SettingsShape[K]> {
    const all = await this.repo.get();
    return all[key];
  }

  async publicSubset(): Promise<PublicSettingsShape> {
    const all = await this.repo.get();
    return {
      multi_region_enabled: all.multi_region_enabled,
      default_region_code: all.default_region_code,
      default_locale_code: all.default_locale_code,
    };
  }

  update(patch: Partial<SettingsShape>): Promise<SettingsShape> {
    return this.repo.update(patch);
  }
}
