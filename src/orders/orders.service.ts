import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './domain/order';
import { SubOrderFulfillmentStatus } from './domain/order-enums';
import { SubOrder } from './domain/sub-order';
import { AddressSnapshot } from './domain/address-snapshot';
import { OrderPaymentStatus } from './domain/order-enums';
import { OrderAbstractRepository } from './infrastructure/persistence/order.abstract.repository';

export interface ListMineOptions {
  page?: number;
  limit?: number;
}

export interface ListForVendorOptions {
  status?: SubOrderFulfillmentStatus;
  page?: number;
  limit?: number;
}

export interface VendorOrderListItemDto {
  id: string;
  vendorId: string;
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
  fulfillmentStatus: SubOrderFulfillmentStatus;
  trackingNumber: string | null;
  courierName: string | null;
  packedAt: Date | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
  order: {
    publicCode: string;
    placedAt: Date;
    buyerName: string;
    city: string;
    country: string;
  };
}

export interface VendorOrderDetailDto extends Omit<SubOrder, 'items'> {
  items: SubOrder['items'];
  itemCount: number;
  order: {
    publicCode: string;
    placedAt: Date;
    buyerName: string;
    city: string;
    country: string;
    addressSnapshot: AddressSnapshot;
    paymentStatus: OrderPaymentStatus;
    currencyCode: string;
  };
}

@Injectable()
export class OrdersService {
  constructor(private readonly orders: OrderAbstractRepository) {}

  async getById(buyerId: number, orderId: string): Promise<Order> {
    const order = await this.orders.findHydratedById(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.buyerId !== buyerId) {
      throw new ForbiddenException('You do not own this order');
    }
    return order;
  }

  async listMine(
    buyerId: number,
    opts: ListMineOptions,
  ): Promise<{ data: Order[]; total: number }> {
    const page = opts.page ?? 1;
    const limit = Math.min(opts.limit ?? 20, 100);
    return this.orders.listForBuyer({ buyerId, page, limit });
  }

  async listForVendor(
    vendorId: string,
    opts: ListForVendorOptions,
  ): Promise<{ data: VendorOrderListItemDto[]; total: number }> {
    const page = opts.page ?? 1;
    const limit = Math.min(opts.limit ?? 20, 100);
    const result = await this.orders.listSubOrdersForVendor({
      vendorId,
      status: opts.status,
      page,
      limit,
    });
    return {
      data: result.data.map((row) => ({
        id: row.subOrder.id,
        vendorId: row.subOrder.vendorId,
        subtotalMinor: row.subOrder.subtotalMinor,
        shippingMinor: row.subOrder.shippingMinor,
        totalMinor: row.subOrder.totalMinor,
        fulfillmentStatus: row.subOrder.fulfillmentStatus,
        trackingNumber: row.subOrder.trackingNumber,
        courierName: row.subOrder.courierName,
        packedAt: row.subOrder.packedAt,
        shippedAt: row.subOrder.shippedAt,
        deliveredAt: row.subOrder.deliveredAt,
        createdAt: row.subOrder.createdAt,
        updatedAt: row.subOrder.updatedAt,
        itemCount: row.itemCount,
        order: row.order,
      })),
      total: result.total,
    };
  }

  async getSubOrderForVendor(
    vendorId: string,
    subOrderId: string,
  ): Promise<VendorOrderDetailDto> {
    const row = await this.orders.findSubOrderForVendor(vendorId, subOrderId);
    // Use 404 (not 403) so we don't leak existence to other vendors.
    if (!row) throw new NotFoundException('SubOrder not found');

    const totalQty = (row.subOrder.items ?? []).reduce(
      (acc, it) => acc + it.quantity,
      0,
    );

    return {
      id: row.subOrder.id,
      orderId: row.subOrder.orderId,
      vendorId: row.subOrder.vendorId,
      subtotalMinor: row.subOrder.subtotalMinor,
      shippingMinor: row.subOrder.shippingMinor,
      totalMinor: row.subOrder.totalMinor,
      fulfillmentStatus: row.subOrder.fulfillmentStatus,
      trackingNumber: row.subOrder.trackingNumber,
      courierName: row.subOrder.courierName,
      packedAt: row.subOrder.packedAt,
      shippedAt: row.subOrder.shippedAt,
      deliveredAt: row.subOrder.deliveredAt,
      items: row.subOrder.items,
      createdAt: row.subOrder.createdAt,
      updatedAt: row.subOrder.updatedAt,
      itemCount: totalQty,
      order: {
        publicCode: row.order.publicCode,
        placedAt: row.order.placedAt,
        buyerName: row.order.addressSnapshot.fullName,
        city: row.order.addressSnapshot.city,
        country: row.order.addressSnapshot.country,
        addressSnapshot: row.order.addressSnapshot,
        paymentStatus: row.order.paymentStatus,
        currencyCode: row.order.currencyCode,
      },
    };
  }
}
