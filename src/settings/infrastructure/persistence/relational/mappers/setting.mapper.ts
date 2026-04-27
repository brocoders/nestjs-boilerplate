import { SettingsShape, DEFAULT_SETTINGS } from '../../../../domain/setting';
import { SettingEntity } from '../entities/setting.entity';

export class SettingMapper {
  static toShape(entity: SettingEntity | null): SettingsShape {
    if (!entity) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...entity.values };
  }
}
