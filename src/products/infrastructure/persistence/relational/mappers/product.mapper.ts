import { Product } from '../../../../domain/product';
import { ProductEntity } from '../entities/product.entity';

export class ProductMapper {
  static toDomain(entity: ProductEntity): Product {
    const d = new Product();
    d.id = entity.id;
    d.vendorId = entity.vendorId;
    if (entity.vendor && entity.vendor.slug) {
      d.vendorSlug = entity.vendor.slug;
    }
    d.categoryId = entity.categoryId;
    d.slug = entity.slug;
    d.nameTranslations = entity.nameTranslations;
    d.descriptionTranslations = entity.descriptionTranslations ?? {};
    d.status = entity.status;
    d.baseCurrency = entity.baseCurrency;
    d.supportedRegionIds = entity.supportedRegionIds ?? [];
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
