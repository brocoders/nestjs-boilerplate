import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { ProductStatus } from '../products/domain/product';
import { ProductAbstractRepository } from '../products/infrastructure/persistence/product.abstract.repository';
import { ProductVariantAbstractRepository } from '../products/infrastructure/persistence/product-variant.abstract.repository';
import { RegionsService } from '../regions/regions.service';
import { Cart } from './domain/cart';
import { CartItem } from './domain/cart-item';
import { CartAbstractRepository } from './infrastructure/persistence/cart.abstract.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly carts: CartAbstractRepository,
    private readonly variants: ProductVariantAbstractRepository,
    private readonly products: ProductAbstractRepository,
    private readonly regions: RegionsService,
  ) {}

  async getCurrent(userId: number): Promise<Cart> {
    const hydrated = await this.carts.findHydratedCartByUserId(userId);
    if (hydrated) return hydrated;
    // Buyer with no cart yet — return an empty shape locked to default region.
    const region = await this.regions.getDefault();
    return {
      id: '',
      userId,
      regionId: region.id,
      currencyCode: region.currencyCode,
      items: [],
      createdAt: new Date(0),
      updatedAt: new Date(0),
    } as Cart;
  }

  async addItem(
    userId: number,
    variantId: string,
    quantity: number,
  ): Promise<CartItem> {
    const variant = await this.variants.findVariantById(variantId);
    if (!variant || !variant.isActive) {
      throw new NotFoundException('Variant not found');
    }
    const product = await this.products.findById(variant.productId);
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new UnprocessableEntityException('Product is not available');
    }
    if ((variant.stock?.quantity ?? 0) <= 0) {
      throw new UnprocessableEntityException('Variant is out of stock');
    }

    let cart = await this.carts.findCartByUserId(userId);

    // Decide which region we should price against.
    let pricingRegionId: string;
    if (cart) {
      pricingRegionId = cart.regionId;
    } else {
      const defaultRegion = await this.regions.getDefault();
      pricingRegionId = defaultRegion.id;
    }

    const price = (variant.prices ?? []).find(
      (p) => p.regionId === pricingRegionId,
    );
    if (!price) {
      throw new UnprocessableEntityException(
        cart
          ? 'This item has no price for the cart region'
          : 'This item has no price for your default region',
      );
    }

    if (!cart) {
      cart = await this.carts.createCart({
        id: uuidv7Generate(),
        userId,
        regionId: pricingRegionId,
        currencyCode: price.currencyCode,
      });
    }

    return this.carts.upsertCartItem({
      id: uuidv7Generate(),
      cartId: cart.id,
      variantId,
      quantity,
      unitPriceSnapshot: price.priceMinorUnits,
      currencySnapshot: price.currencyCode,
    });
  }

  async updateQuantity(
    userId: number,
    cartItemId: string,
    quantity: number,
  ): Promise<CartItem> {
    const cart = await this.carts.findCartByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');
    const item = await this.carts.findCartItemById(cartItemId);
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.cartId !== cart.id) {
      throw new ForbiddenException('You do not own this cart item');
    }

    // Refresh price snapshot from the live variant price for the cart's region.
    const variant = await this.variants.findVariantById(item.variantId);
    if (!variant) throw new NotFoundException('Variant no longer exists');
    const price = (variant.prices ?? []).find(
      (p) => p.regionId === cart.regionId,
    );
    if (!price) {
      throw new UnprocessableEntityException(
        'This item no longer has a price for the cart region',
      );
    }

    return this.carts.updateItemQuantity(
      cartItemId,
      quantity,
      price.priceMinorUnits,
      price.currencyCode,
    );
  }

  async removeItem(userId: number, cartItemId: string): Promise<void> {
    const cart = await this.carts.findCartByUserId(userId);
    if (!cart) throw new NotFoundException('Cart not found');
    const item = await this.carts.findCartItemById(cartItemId);
    if (!item) throw new NotFoundException('Cart item not found');
    if (item.cartId !== cart.id) {
      throw new ForbiddenException('You do not own this cart item');
    }
    await this.carts.deleteItem(cartItemId);
  }

  async clear(userId: number): Promise<void> {
    const cart = await this.carts.findCartByUserId(userId);
    if (!cart) return;
    await this.carts.clearItems(cart.id);
  }
}
