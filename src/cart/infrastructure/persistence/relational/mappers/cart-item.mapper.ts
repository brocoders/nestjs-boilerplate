import { CartItem } from '../../../../domain/cart-item';
import { CartItemEntity } from '../entities/cart-item.entity';

export class CartItemMapper {
  static toDomain(entity: CartItemEntity): CartItem {
    const d = new CartItem();
    d.id = entity.id;
    d.cartId = entity.cartId;
    d.variantId = entity.variantId;
    d.quantity = entity.quantity;
    d.unitPriceSnapshot = String(entity.unitPriceSnapshot);
    d.currencySnapshot = entity.currencySnapshot;
    d.addedAt = entity.addedAt;
    return d;
  }
}
