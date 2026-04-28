import { ProductVariant } from '../../../../domain/product-variant';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { VariantPriceMapper } from './variant-price.mapper';
import { VariantStockMapper } from './variant-stock.mapper';

export class ProductVariantMapper {
  static toDomain(entity: ProductVariantEntity): ProductVariant {
    const d = new ProductVariant();
    d.id = entity.id;
    d.productId = entity.productId;
    d.sku = entity.sku;
    d.weightGrams = entity.weightGrams;
    d.isActive = entity.isActive;
    d.optionValueIds = (entity.optionValues ?? []).map((ov) => ({
      optionTypeId: ov.optionTypeId,
      optionValueId: ov.optionValueId,
    }));
    d.prices = (entity.prices ?? []).map(VariantPriceMapper.toDomain);
    d.stock = entity.stock ? VariantStockMapper.toDomain(entity.stock) : null;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
