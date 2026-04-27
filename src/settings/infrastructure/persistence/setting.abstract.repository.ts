import { SettingsShape } from '../../domain/setting';

export abstract class SettingAbstractRepository {
  abstract get(): Promise<SettingsShape>;
  abstract update(patch: Partial<SettingsShape>): Promise<SettingsShape>;
}
