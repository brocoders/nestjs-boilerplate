import { EntityManager } from 'typeorm';
import { AddressSnapshot } from '../../domain/address-snapshot';
import { Order } from '../../domain/order';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  SubOrderFulfillmentStatus,
} from '../../domain/order-enums';
import { SubOrder } from '../../domain/sub-order';

export interface CreateOrderRow {
  id: string;
  buyerId: number;
  publicCode: string;
  regionId: string;
  currencyCode: string;
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
  paymentMethod: OrderPaymentMethod;
  paymentStatus: OrderPaymentStatus;
  addressSnapshot: AddressSnapshot;
}

export interface CreateSubOrderRow {
  id: string;
  orderId: string;
  vendorId: string;
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
  fulfillmentStatus: SubOrderFulfillmentStatus;
}

export interface CreateOrderItemRow {
  id: string;
  subOrderId: string;
  variantId: string;
  productId: string;
  vendorId: string;
  quantity: number;
  unitPriceSnapshot: string;
  currencySnapshot: string;
  nameSnapshotTranslations: Record<string, string>;
  imageSnapshotUrl: string | null;
  skuSnapshot: string;
}

export interface ListOrdersOptions {
  buyerId: number;
  page: number;
  limit: number;
}

export interface ListOrdersResult {
  data: Order[];
  total: number;
}

// ── Vendor-side incoming orders ──────────────────────────────────────

export interface VendorOrderListItem {
  subOrder: SubOrder;
  order: {
    publicCode: string;
    placedAt: Date;
    buyerName: string;
    city: string;
    country: string;
  };
  itemCount: number;
}

export interface VendorOrderListResult {
  data: VendorOrderListItem[];
  total: number;
}

export interface ListSubOrdersForVendorOptions {
  vendorId: string;
  status?: SubOrderFulfillmentStatus;
  page: number;
  limit: number;
}

export interface VendorOrderDetail {
  subOrder: SubOrder;
  order: {
    publicCode: string;
    placedAt: Date;
    addressSnapshot: AddressSnapshot;
    paymentStatus: OrderPaymentStatus;
    currencyCode: string;
  };
}

export abstract class OrderAbstractRepository {
  abstract isPublicCodeTaken(publicCode: string): Promise<boolean>;
  abstract createOrderTransaction(input: {
    order: CreateOrderRow;
    subOrders: CreateSubOrderRow[];
    items: CreateOrderItemRow[];
    cartIdToClear: string | null;
  }): Promise<string>;
  abstract findHydratedById(orderId: string): Promise<Order | null>;
  abstract listForBuyer(opts: ListOrdersOptions): Promise<ListOrdersResult>;
  abstract listSubOrdersForVendor(
    opts: ListSubOrdersForVendorOptions,
  ): Promise<VendorOrderListResult>;
  abstract findSubOrderForVendor(
    vendorId: string,
    subOrderId: string,
  ): Promise<VendorOrderDetail | null>;
  /** Used by the placeOrder transaction internally for re-loading the cart. */
  abstract entityManager(): EntityManager;
}
