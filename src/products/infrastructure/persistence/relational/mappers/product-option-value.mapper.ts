import { ProductOptionValue } from '../../../../domain/product-option-value';
import { ProductOptionValueEntity } from '../entities/product-option-value.entity';

export class ProductOptionValueMapper {
  static toDomain(entity: ProductOptionValueEntity): ProductOptionValue {
    const d = new ProductOptionValue();
    d.id = entity.id;
    d.optionTypeId = entity.optionTypeId;
    d.slug = entity.slug;
    d.valueTranslations = entity.valueTranslations;
    d.swatchColor = entity.swatchColor ?? null;
    d.position = entity.position;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
