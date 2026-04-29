import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariantMapper } from '../../../../../products/infrastructure/persistence/relational/mappers/product-variant.mapper';
import { Cart } from '../../../../domain/cart';
import { CartItem } from '../../../../domain/cart-item';
import {
  CartAbstractRepository,
  CreateCartInput,
  UpsertCartItemInput,
} from '../../cart.abstract.repository';
import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartMapper } from '../mappers/cart.mapper';
import { CartItemMapper } from '../mappers/cart-item.mapper';

@Injectable()
export class CartRelationalRepository implements CartAbstractRepository {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepo: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private readonly itemRepo: Repository<CartItemEntity>,
  ) {}

  async findCartByUserId(userId: number): Promise<Cart | null> {
    const row = await this.cartRepo.findOne({ where: { userId } });
    if (!row) return null;
    const cart = CartMapper.toDomain(row);
    cart.items = [];
    return cart;
  }

  async createCart(input: CreateCartInput): Promise<Cart> {
    const entity = this.cartRepo.create(input);
    const saved = await this.cartRepo.save(entity);
    const d = CartMapper.toDomain(saved);
    d.items = [];
    return d;
  }

  async findCartItemById(itemId: string): Promise<CartItem | null> {
    const row = await this.itemRepo.findOne({ where: { id: itemId } });
    return row ? CartItemMapper.toDomain(row) : null;
  }

  async upsertCartItem(input: UpsertCartItemInput): Promise<CartItem> {
    // Try to find an existing row keyed on the unique (cart_id, variant_id).
    const existing = await this.itemRepo.findOne({
      where: { cartId: input.cartId, variantId: input.variantId },
    });
    if (existing) {
      existing.quantity += input.quantity;
      existing.unitPriceSnapshot = input.unitPriceSnapshot;
      existing.currencySnapshot = input.currencySnapshot;
      const saved = await this.itemRepo.save(existing);
      return CartItemMapper.toDomain(saved);
    }
    const created = this.itemRepo.create({
      id: input.id,
      cartId: input.cartId,
      variantId: input.variantId,
      quantity: input.quantity,
      unitPriceSnapshot: input.unitPriceSnapshot,
      currencySnapshot: input.currencySnapshot,
    });
    const saved = await this.itemRepo.save(created);
    return CartItemMapper.toDomain(saved);
  }

  async updateItemQuantity(
    itemId: string,
    quantity: number,
    unitPriceSnapshot: string,
    currencySnapshot: string,
  ): Promise<CartItem> {
    await this.itemRepo.update(
      { id: itemId },
      { quantity, unitPriceSnapshot, currencySnapshot },
    );
    const row = await this.itemRepo.findOneOrFail({ where: { id: itemId } });
    return CartItemMapper.toDomain(row);
  }

  async deleteItem(itemId: string): Promise<void> {
    await this.itemRepo.delete({ id: itemId });
  }

  async clearItems(cartId: string): Promise<void> {
    await this.itemRepo.delete({ cartId });
  }

  async findHydratedCartByUserId(userId: number): Promise<Cart | null> {
    const cartRow = await this.cartRepo.findOne({ where: { userId } });
    if (!cartRow) return null;

    // Heavy join: cart_item × variant × product × vendor.
    const rows = await this.itemRepo
      .createQueryBuilder('ci')
      .leftJoinAndSelect('ci.variant', 'v')
      .leftJoinAndSelect('v.optionValues', 'ov')
      .leftJoinAndSelect('v.prices', 'p')
      .leftJoinAndSelect('v.stock', 'st')
      .leftJoinAndSelect('v.product', 'prod')
      .leftJoinAndSelect('prod.vendor', 'vendor')
      .where('ci.cart_id = :cartId', { cartId: cartRow.id })
      .orderBy('ci.added_at', 'ASC')
      .getMany();

    const cart = CartMapper.toDomain(cartRow);
    // Re-build items with hydration.
    cart.items = rows.map((row) => {
      const item = CartItemMapper.toDomain(row);
      if (row.variant) {
        item.variant = ProductVariantMapper.toDomain(row.variant);
        const product = (row.variant as { product?: unknown }).product as
          | {
              id: string;
              slug: string;
              nameTranslations: Record<string, string>;
              vendor?: { id: string; slug: string } | null;
            }
          | undefined;
        if (product) {
          item.productSlug = product.slug;
          item.productNameTranslations = product.nameTranslations;
          if (product.vendor) {
            item.vendorId = product.vendor.id;
            item.vendorSlug = product.vendor.slug;
          }
        }
      }
      item.productImageUrl = null;
      return item;
    });
    return cart;
  }
}
