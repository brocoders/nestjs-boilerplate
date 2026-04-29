import { OrderItem } from '../../../../domain/order-item';
import { OrderItemEntity } from '../entities/order-item.entity';

export class OrderItemMapper {
  static toDomain(entity: OrderItemEntity): OrderItem {
    const d = new OrderItem();
    d.id = entity.id;
    d.subOrderId = entity.subOrderId;
    d.variantId = entity.variantId;
    d.productId = entity.productId;
    d.vendorId = entity.vendorId;
    d.quantity = entity.quantity;
    d.unitPriceSnapshot = String(entity.unitPriceSnapshot);
    d.currencySnapshot = entity.currencySnapshot;
    d.nameSnapshotTranslations = entity.nameSnapshotTranslations ?? {};
    d.imageSnapshotUrl = entity.imageSnapshotUrl ?? null;
    d.skuSnapshot = entity.skuSnapshot;
    d.createdAt = entity.createdAt;
    return d;
  }
}
