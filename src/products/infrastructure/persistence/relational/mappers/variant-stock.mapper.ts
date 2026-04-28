import { VariantStock } from '../../../../domain/variant-stock';
import { VariantStockEntity } from '../entities/variant-stock.entity';

export class VariantStockMapper {
  static toDomain(entity: VariantStockEntity): VariantStock {
    const d = new VariantStock();
    d.variantId = entity.variantId;
    d.quantity = entity.quantity;
    d.reservedQuantity = entity.reservedQuantity;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
