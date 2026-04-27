import { Region } from '../../../../domain/region';
import { RegionEntity } from '../entities/region.entity';

export class RegionMapper {
  static toDomain(entity: RegionEntity): Region {
    const d = new Region();
    d.id = entity.id;
    d.code = entity.code;
    d.nameTranslations = entity.nameTranslations;
    d.currencyCode = entity.currencyCode;
    d.defaultLocale = entity.defaultLocale;
    d.isEnabled = entity.isEnabled;
    d.isDefault = entity.isDefault;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
