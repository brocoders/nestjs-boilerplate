import { ProductOptionType } from '../../../../domain/product-option-type';
import { ProductOptionTypeEntity } from '../entities/product-option-type.entity';
import { ProductOptionValueMapper } from './product-option-value.mapper';

export class ProductOptionTypeMapper {
  static toDomain(entity: ProductOptionTypeEntity): ProductOptionType {
    const d = new ProductOptionType();
    d.id = entity.id;
    d.productId = entity.productId;
    d.slug = entity.slug;
    d.nameTranslations = entity.nameTranslations;
    d.position = entity.position;
    d.values = (entity.values ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(ProductOptionValueMapper.toDomain);
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
