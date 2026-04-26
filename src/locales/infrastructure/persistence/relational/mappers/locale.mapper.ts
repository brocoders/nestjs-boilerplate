import { Locale } from '../../../../domain/locale';
import { LocaleEntity } from '../entities/locale.entity';

export class LocaleMapper {
  static toDomain(entity: LocaleEntity): Locale {
    const d = new Locale();
    d.id = entity.id;
    d.code = entity.code;
    d.nativeName = entity.nativeName;
    d.isRtl = entity.isRtl;
    d.isEnabled = entity.isEnabled;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
