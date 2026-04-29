import { SubOrder } from '../../../../domain/sub-order';
import { SubOrderEntity } from '../entities/sub-order.entity';
import { OrderItemMapper } from './order-item.mapper';

export class SubOrderMapper {
  static toDomain(entity: SubOrderEntity): SubOrder {
    const d = new SubOrder();
    d.id = entity.id;
    d.orderId = entity.orderId;
    d.vendorId = entity.vendorId;
    d.subtotalMinor = String(entity.subtotalMinor);
    d.shippingMinor = String(entity.shippingMinor);
    d.totalMinor = String(entity.totalMinor);
    d.fulfillmentStatus = entity.fulfillmentStatus;
    d.trackingNumber = entity.trackingNumber ?? null;
    d.courierName = entity.courierName ?? null;
    d.packedAt = entity.packedAt ?? null;
    d.shippedAt = entity.shippedAt ?? null;
    d.deliveredAt = entity.deliveredAt ?? null;
    d.items = (entity.items ?? []).map(OrderItemMapper.toDomain);
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
