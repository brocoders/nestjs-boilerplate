import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './domain/order';
import { OrderAbstractRepository } from './infrastructure/persistence/order.abstract.repository';

export interface ListMineOptions {
  page?: number;
  limit?: number;
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
}
