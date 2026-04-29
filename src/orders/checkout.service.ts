import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { CartItem } from '../cart/domain/cart-item';
import { ProductAbstractRepository } from '../products/infrastructure/persistence/product.abstract.repository';
import { ProductVariantAbstractRepository } from '../products/infrastructure/persistence/product-variant.abstract.repository';
import { ShippingZone } from '../shipping-zones/domain/shipping-zone';
import { ShippingZonesService } from '../shipping-zones/shipping-zones.service';
import { uuidv7Generate } from '../utils/uuid';
import { VendorsService } from '../vendors/vendors.service';
import { AddressSnapshot } from './domain/address-snapshot';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  SubOrderFulfillmentStatus,
} from './domain/order-enums';
import { Order } from './domain/order';
import {
  CreateOrderItemRow,
  CreateOrderRow,
  CreateSubOrderRow,
  OrderAbstractRepository,
} from './infrastructure/persistence/order.abstract.repository';

export interface QuoteVendorItem {
  cartItemId: string;
  variantId: string;
  productSlug: string;
  productNameTranslations: Record<string, string>;
  sku: string;
  quantity: number;
  unitPriceMinor: string;
  lineTotalMinor: string;
}

export interface QuoteVendor {
  vendorId: string;
  vendorSlug: string;
  vendorName: Record<string, string>;
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
  estDeliveryDaysMin: number;
  estDeliveryDaysMax: number;
  items: QuoteVendorItem[];
}

export interface QuoteResult {
  cartId: string;
  regionId: string;
  currencyCode: string;
  vendors: QuoteVendor[];
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
}

interface PreparedItem {
  cartItem: CartItem;
  vendorId: string;
  productId: string;
  productSlug: string;
  productName: Record<string, string>;
  vendorSlug: string;
  vendorName: Record<string, string>;
  sku: string;
  unitPriceMinor: string;
  currencyCode: string;
  lineTotalMinor: string;
}

interface PreparedVendorGroup {
  vendorId: string;
  vendorSlug: string;
  vendorName: Record<string, string>;
  zone: ShippingZone;
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
  items: PreparedItem[];
}

interface Breakdown {
  cartId: string;
  regionId: string;
  currencyCode: string;
  groups: PreparedVendorGroup[];
  subtotalMinor: string;
  shippingMinor: string;
  totalMinor: string;
}

const PUBLIC_CODE_PREFIX = 'ORD-';
const PUBLIC_CODE_LENGTH = 6;
const PUBLIC_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // base32-ish, no 0/1/I/L/O
const PUBLIC_CODE_MAX_RETRIES = 10;

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly cart: CartService,
    private readonly shippingZones: ShippingZonesService,
    private readonly vendors: VendorsService,
    private readonly products: ProductAbstractRepository,
    private readonly variants: ProductVariantAbstractRepository,
    private readonly orders: OrderAbstractRepository,
  ) {}

  async quote(userId: number, address: AddressSnapshot): Promise<QuoteResult> {
    const breakdown = await this.buildBreakdown(userId, address);
    return this.toQuoteResult(breakdown);
  }

  /**
   * Atomic place-order. Re-loads the cart inside the transaction-prep phase
   * so the breakdown reflects current prices/zones, then writes everything
   * in one TypeORM transaction.
   */
  async placeOrder(
    userId: number,
    address: AddressSnapshot,
    paymentMethod: OrderPaymentMethod,
  ): Promise<Order> {
    const breakdown = await this.buildBreakdown(userId, address);

    const orderId = uuidv7Generate();
    const publicCode = await this.allocatePublicCode();

    const orderRow: CreateOrderRow = {
      id: orderId,
      buyerId: userId,
      publicCode,
      regionId: breakdown.regionId,
      currencyCode: breakdown.currencyCode,
      subtotalMinor: breakdown.subtotalMinor,
      shippingMinor: breakdown.shippingMinor,
      totalMinor: breakdown.totalMinor,
      paymentMethod,
      paymentStatus: OrderPaymentStatus.PENDING,
      addressSnapshot: address,
    };

    const subOrderRows: CreateSubOrderRow[] = [];
    const itemRows: CreateOrderItemRow[] = [];

    for (const group of breakdown.groups) {
      const subOrderId = uuidv7Generate();
      subOrderRows.push({
        id: subOrderId,
        orderId,
        vendorId: group.vendorId,
        subtotalMinor: group.subtotalMinor,
        shippingMinor: group.shippingMinor,
        totalMinor: group.totalMinor,
        fulfillmentStatus: SubOrderFulfillmentStatus.AWAITING_CONFIRMATION,
      });

      for (const prepared of group.items) {
        itemRows.push({
          id: uuidv7Generate(),
          subOrderId,
          variantId: prepared.cartItem.variantId,
          productId: prepared.productId,
          vendorId: prepared.vendorId,
          quantity: prepared.cartItem.quantity,
          unitPriceSnapshot: prepared.unitPriceMinor,
          currencySnapshot: prepared.currencyCode,
          nameSnapshotTranslations: prepared.productName,
          imageSnapshotUrl: null,
          skuSnapshot: prepared.sku,
        });
      }
    }

    await this.orders.createOrderTransaction({
      order: orderRow,
      subOrders: subOrderRows,
      items: itemRows,
      cartIdToClear: breakdown.cartId || null,
    });

    const hydrated = await this.orders.findHydratedById(orderId);
    if (!hydrated) {
      // Should be impossible — we just inserted it.
      throw new InternalServerErrorException(
        'Order placement succeeded but order is missing on read-back',
      );
    }
    return hydrated;
  }

  /**
   * Shared logic for `quote` and `placeOrder`. Loads the cart, groups items
   * by vendor, resolves a shipping zone per vendor, and computes per-vendor
   * and grand totals. Throws 422 on empty cart or unshippable address.
   */
  private async buildBreakdown(
    userId: number,
    address: AddressSnapshot,
  ): Promise<Breakdown> {
    const cart = await this.cart.getCurrent(userId);
    if (!cart.id || cart.items.length === 0) {
      throw new UnprocessableEntityException('Cart is empty');
    }

    // Group cart items by vendor. The hydrated cart already has vendorId
    // populated on each item, but defensively re-resolve when missing.
    const itemsByVendor = new Map<string, CartItem[]>();
    for (const item of cart.items) {
      let vendorId = item.vendorId;
      if (!vendorId) {
        // Defensive lookup via product → vendor.
        const variant = await this.variants.findVariantById(item.variantId);
        if (!variant) {
          throw new UnprocessableEntityException(
            'A cart item references an unknown variant',
          );
        }
        const product = await this.products.findById(variant.productId);
        if (!product) {
          throw new UnprocessableEntityException(
            'A cart item references an unknown product',
          );
        }
        vendorId = product.vendorId;
      }
      const bucket = itemsByVendor.get(vendorId);
      if (bucket) {
        bucket.push(item);
      } else {
        itemsByVendor.set(vendorId, [item]);
      }
    }

    // Build prepared items + vendor groups.
    const groups: PreparedVendorGroup[] = [];
    let grandSubtotal = 0n;
    let grandShipping = 0n;

    // Iterate in deterministic vendor-id order so the response shape is stable.
    const vendorIds = Array.from(itemsByVendor.keys()).sort();

    for (const vendorId of vendorIds) {
      const items = itemsByVendor.get(vendorId)!;
      const vendor = await this.vendors.getById(vendorId);

      // Resolve a shipping zone for this vendor + destination.
      const zone = await this.shippingZones.resolveForVendor(
        vendorId,
        address.country,
        address.region ?? undefined,
      );
      if (!zone) {
        const vendorName =
          vendor.nameTranslations.en ??
          Object.values(vendor.nameTranslations)[0] ??
          vendor.slug;
        throw new UnprocessableEntityException(
          `${vendorName} doesn't ship to ${address.country}`,
        );
      }

      // Re-snapshot each item from the live variant price for the cart's region.
      const preparedItems: PreparedItem[] = [];
      let vendorSubtotal = 0n;

      for (const item of items) {
        const variant = await this.variants.findVariantById(item.variantId);
        if (!variant || !variant.isActive) {
          throw new UnprocessableEntityException(
            'A cart item references an inactive variant',
          );
        }
        const product = await this.products.findById(variant.productId);
        if (!product) {
          throw new UnprocessableEntityException(
            'A cart item references an unknown product',
          );
        }
        const livePrice = (variant.prices ?? []).find(
          (p) => p.regionId === cart.regionId,
        );
        if (!livePrice) {
          throw new UnprocessableEntityException(
            'A cart item no longer has a price for the cart region',
          );
        }
        const qty = BigInt(item.quantity);
        const unit = BigInt(livePrice.priceMinorUnits);
        const lineTotal = unit * qty;
        vendorSubtotal += lineTotal;

        preparedItems.push({
          cartItem: item,
          vendorId,
          productId: product.id,
          productSlug: product.slug,
          productName: product.nameTranslations,
          vendorSlug: vendor.slug,
          vendorName: vendor.nameTranslations,
          sku: variant.sku,
          unitPriceMinor: livePrice.priceMinorUnits,
          currencyCode: livePrice.currencyCode,
          lineTotalMinor: lineTotal.toString(),
        });
      }

      // Apply free-shipping threshold if configured.
      let vendorShipping = BigInt(zone.costMinorUnits);
      if (
        zone.freeAboveMinorUnits !== null &&
        vendorSubtotal >= BigInt(zone.freeAboveMinorUnits)
      ) {
        vendorShipping = 0n;
      }
      const vendorTotal = vendorSubtotal + vendorShipping;

      grandSubtotal += vendorSubtotal;
      grandShipping += vendorShipping;

      groups.push({
        vendorId,
        vendorSlug: vendor.slug,
        vendorName: vendor.nameTranslations,
        zone,
        subtotalMinor: vendorSubtotal.toString(),
        shippingMinor: vendorShipping.toString(),
        totalMinor: vendorTotal.toString(),
        items: preparedItems,
      });
    }

    return {
      cartId: cart.id,
      regionId: cart.regionId,
      currencyCode: cart.currencyCode,
      groups,
      subtotalMinor: grandSubtotal.toString(),
      shippingMinor: grandShipping.toString(),
      totalMinor: (grandSubtotal + grandShipping).toString(),
    };
  }

  private toQuoteResult(b: Breakdown): QuoteResult {
    return {
      cartId: b.cartId,
      regionId: b.regionId,
      currencyCode: b.currencyCode,
      vendors: b.groups.map((g) => ({
        vendorId: g.vendorId,
        vendorSlug: g.vendorSlug,
        vendorName: g.vendorName,
        subtotalMinor: g.subtotalMinor,
        shippingMinor: g.shippingMinor,
        totalMinor: g.totalMinor,
        estDeliveryDaysMin: g.zone.estDeliveryDaysMin,
        estDeliveryDaysMax: g.zone.estDeliveryDaysMax,
        items: g.items.map((it) => ({
          cartItemId: it.cartItem.id,
          variantId: it.cartItem.variantId,
          productSlug: it.productSlug,
          productNameTranslations: it.productName,
          sku: it.sku,
          quantity: it.cartItem.quantity,
          unitPriceMinor: it.unitPriceMinor,
          lineTotalMinor: it.lineTotalMinor,
        })),
      })),
      subtotalMinor: b.subtotalMinor,
      shippingMinor: b.shippingMinor,
      totalMinor: b.totalMinor,
    };
  }

  private async allocatePublicCode(): Promise<string> {
    for (let attempt = 0; attempt < PUBLIC_CODE_MAX_RETRIES; attempt++) {
      const candidate = this.randomPublicCode();
      const taken = await this.orders.isPublicCodeTaken(candidate);
      if (!taken) return candidate;
      this.logger.warn(
        `public_code collision on attempt ${attempt + 1}: ${candidate}`,
      );
    }
    throw new InternalServerErrorException(
      'Could not allocate a unique order code',
    );
  }

  private randomPublicCode(): string {
    let body = '';
    for (let i = 0; i < PUBLIC_CODE_LENGTH; i++) {
      const idx = Math.floor(Math.random() * PUBLIC_CODE_ALPHABET.length);
      body += PUBLIC_CODE_ALPHABET[idx];
    }
    return `${PUBLIC_CODE_PREFIX}${body}`;
  }
}
