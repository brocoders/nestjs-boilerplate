import { VariantPrice } from '../../../../domain/variant-price';
import { VariantPriceEntity } from '../entities/variant-price.entity';

export class VariantPriceMapper {
  static toDomain(entity: VariantPriceEntity): VariantPrice {
    const d = new VariantPrice();
    d.id = entity.id;
    d.variantId = entity.variantId;
    d.regionId = entity.regionId;
    d.currencyCode = entity.currencyCode;
    // bigint columns come back as strings from pg.
    d.priceMinorUnits = String(entity.priceMinorUnits);
    d.compareAtPriceMinorUnits =
      entity.compareAtPriceMinorUnits === null ||
      entity.compareAtPriceMinorUnits === undefined
        ? null
        : String(entity.compareAtPriceMinorUnits);
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
