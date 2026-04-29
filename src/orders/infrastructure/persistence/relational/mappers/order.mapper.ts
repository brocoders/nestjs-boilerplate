import { AddressSnapshot } from '../../../../domain/address-snapshot';
import { Order } from '../../../../domain/order';
import { OrderEntity } from '../entities/order.entity';
import { SubOrderMapper } from './sub-order.mapper';

export class OrderMapper {
  static toDomain(entity: OrderEntity): Order {
    const d = new Order();
    d.id = entity.id;
    d.buyerId = entity.buyerId;
    d.publicCode = entity.publicCode;
    d.regionId = entity.regionId;
    d.currencyCode = entity.currencyCode;
    d.subtotalMinor = String(entity.subtotalMinor);
    d.shippingMinor = String(entity.shippingMinor);
    d.totalMinor = String(entity.totalMinor);
    d.paymentMethod = entity.paymentMethod;
    d.paymentStatus = entity.paymentStatus;
    d.addressSnapshot = entity.addressSnapshot as AddressSnapshot;
    d.placedAt = entity.placedAt;
    d.subOrders = (entity.subOrders ?? []).map(SubOrderMapper.toDomain);
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
