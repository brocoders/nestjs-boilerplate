import { Cart } from '../../../../domain/cart';
import { CartEntity } from '../entities/cart.entity';
import { CartItemMapper } from './cart-item.mapper';

export class CartMapper {
  static toDomain(entity: CartEntity): Cart {
    const d = new Cart();
    d.id = entity.id;
    d.userId = entity.userId;
    d.regionId = entity.regionId;
    d.currencyCode = entity.currencyCode;
    d.items = (entity.items ?? []).map(CartItemMapper.toDomain);
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
