import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order } from '../../../../domain/order';
import {
  CreateOrderItemRow,
  CreateOrderRow,
  CreateSubOrderRow,
  ListOrdersOptions,
  ListOrdersResult,
  OrderAbstractRepository,
} from '../../order.abstract.repository';
import { OrderEntity } from '../entities/order.entity';
import { OrderItemEntity } from '../entities/order-item.entity';
import { SubOrderEntity } from '../entities/sub-order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { CartItemEntity } from '../../../../../cart/infrastructure/persistence/relational/entities/cart-item.entity';

@Injectable()
export class OrderRelationalRepository implements OrderAbstractRepository {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private readonly orderRepo: Repository<OrderEntity>,
  ) {}

  entityManager(): EntityManager {
    return this.dataSource.manager;
  }

  async isPublicCodeTaken(publicCode: string): Promise<boolean> {
    const count = await this.orderRepo.count({ where: { publicCode } });
    return count > 0;
  }

  /**
   * Run the full atomic write of order + sub_orders + items, and clear the
   * cart's items in the same transaction. Returns the new order id.
   */
  async createOrderTransaction(input: {
    order: CreateOrderRow;
    subOrders: CreateSubOrderRow[];
    items: CreateOrderItemRow[];
    cartIdToClear: string | null;
  }): Promise<string> {
    return this.dataSource.transaction(async (em) => {
      const orderRepo = em.getRepository(OrderEntity);
      const subOrderRepo = em.getRepository(SubOrderEntity);
      const itemRepo = em.getRepository(OrderItemEntity);
      const cartItemRepo = em.getRepository(CartItemEntity);

      const orderEntity = orderRepo.create({
        id: input.order.id,
        buyerId: input.order.buyerId,
        publicCode: input.order.publicCode,
        regionId: input.order.regionId,
        currencyCode: input.order.currencyCode,
        subtotalMinor: input.order.subtotalMinor,
        shippingMinor: input.order.shippingMinor,
        totalMinor: input.order.totalMinor,
        paymentMethod: input.order.paymentMethod,
        paymentStatus: input.order.paymentStatus,
        addressSnapshot: input.order.addressSnapshot,
      });
      await orderRepo.save(orderEntity);

      if (input.subOrders.length > 0) {
        const subEntities = input.subOrders.map((s) =>
          subOrderRepo.create({
            id: s.id,
            orderId: s.orderId,
            vendorId: s.vendorId,
            subtotalMinor: s.subtotalMinor,
            shippingMinor: s.shippingMinor,
            totalMinor: s.totalMinor,
            fulfillmentStatus: s.fulfillmentStatus,
          }),
        );
        await subOrderRepo.save(subEntities);
      }

      if (input.items.length > 0) {
        const itemEntities = input.items.map((i) =>
          itemRepo.create({
            id: i.id,
            subOrderId: i.subOrderId,
            variantId: i.variantId,
            productId: i.productId,
            vendorId: i.vendorId,
            quantity: i.quantity,
            unitPriceSnapshot: i.unitPriceSnapshot,
            currencySnapshot: i.currencySnapshot,
            nameSnapshotTranslations: i.nameSnapshotTranslations,
            imageSnapshotUrl: i.imageSnapshotUrl,
            skuSnapshot: i.skuSnapshot,
          }),
        );
        await itemRepo.save(itemEntities);
      }

      if (input.cartIdToClear) {
        await cartItemRepo.delete({ cartId: input.cartIdToClear });
      }

      return input.order.id;
    });
  }

  async findHydratedById(orderId: string): Promise<Order | null> {
    const row = await this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.subOrders', 'so')
      .leftJoinAndSelect('so.items', 'oi')
      .where('o.id = :orderId', { orderId })
      .orderBy('so.created_at', 'ASC')
      .addOrderBy('oi.created_at', 'ASC')
      .getOne();
    return row ? OrderMapper.toDomain(row) : null;
  }

  async listForBuyer(opts: ListOrdersOptions): Promise<ListOrdersResult> {
    const offset = (opts.page - 1) * opts.limit;
    // Two-pass: paginate the order ids first (cheap), then hydrate.
    const [pageRows, total] = await this.orderRepo
      .createQueryBuilder('o')
      .where('o.buyer_id = :buyerId', { buyerId: opts.buyerId })
      .orderBy('o.placed_at', 'DESC')
      .skip(offset)
      .take(opts.limit)
      .getManyAndCount();

    if (pageRows.length === 0) {
      return { data: [], total };
    }

    const ids = pageRows.map((r) => r.id);
    const hydrated = await this.orderRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.subOrders', 'so')
      .leftJoinAndSelect('so.items', 'oi')
      .where('o.id IN (:...ids)', { ids })
      .orderBy('o.placed_at', 'DESC')
      .addOrderBy('so.created_at', 'ASC')
      .addOrderBy('oi.created_at', 'ASC')
      .getMany();

    const byId = new Map(hydrated.map((h) => [h.id, h]));
    const ordered = ids
      .map((id) => byId.get(id))
      .filter((r): r is NonNullable<typeof r> => !!r);

    return {
      data: ordered.map(OrderMapper.toDomain),
      total,
    };
  }
}
