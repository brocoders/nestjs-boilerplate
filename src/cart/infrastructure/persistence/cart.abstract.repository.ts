import { Cart } from '../../domain/cart';
import { CartItem } from '../../domain/cart-item';

export interface CreateCartInput {
  id: string;
  userId: number;
  regionId: string;
  currencyCode: string;
}

export interface UpsertCartItemInput {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  unitPriceSnapshot: string;
  currencySnapshot: string;
}

export abstract class CartAbstractRepository {
  abstract findCartByUserId(userId: number): Promise<Cart | null>;
  abstract createCart(input: CreateCartInput): Promise<Cart>;
  abstract findCartItemById(itemId: string): Promise<CartItem | null>;
  /**
   * Upsert by (cart_id, variant_id). If a row exists, the quantity is
   * INCREMENTED by the supplied quantity and the snapshot is refreshed.
   * Returns the resulting row.
   */
  abstract upsertCartItem(input: UpsertCartItemInput): Promise<CartItem>;
  abstract updateItemQuantity(
    itemId: string,
    quantity: number,
    unitPriceSnapshot: string,
    currencySnapshot: string,
  ): Promise<CartItem>;
  abstract deleteItem(itemId: string): Promise<void>;
  abstract clearItems(cartId: string): Promise<void>;

  /**
   * Hydrated read: cart row + items joined with variant + product + vendor.
   * Returns null when the user has no cart yet.
   */
  abstract findHydratedCartByUserId(userId: number): Promise<Cart | null>;
}
