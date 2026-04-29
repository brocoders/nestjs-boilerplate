import {
  Body,
  ConflictException,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { CheckoutService } from './checkout.service';
import { Order } from './domain/order';
import { PlaceOrderDto } from './dto/place-order.dto';
import { OrderListQueryDto } from './dto/order-list-query.dto';
import { IdempotencyHelper } from './idempotency.helper';
import { OrdersService } from './orders.service';

const IDEMPOTENCY_SCOPE = 'orders';

@ApiTags('Buyer · Orders')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
  constructor(
    private readonly checkout: CheckoutService,
    private readonly orders: OrdersService,
    private readonly idempotency: IdempotencyHelper,
  ) {}

  @Post()
  @ApiOperation({
    summary:
      'Atomically place the current cart as an order (one Order + N SubOrders, one per vendor). Requires Idempotency-Key.',
  })
  @ApiHeader({
    name: 'Idempotency-Key',
    description:
      'Client-generated unique key (16-128 chars, alphanum + dash/underscore). Re-POST with the same key replays the original response.',
    required: true,
  })
  async placeOrder(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() dto: PlaceOrderDto,
    @Headers('idempotency-key') rawKey: string | undefined,
  ): Promise<Order> {
    const userId = (req.user as { id: number }).id;

    if (!rawKey || !rawKey.trim()) {
      throw new UnprocessableEntityException('Idempotency-Key header required');
    }
    const key = rawKey.trim();
    if (!IdempotencyHelper.isValidKey(key)) {
      throw new UnprocessableEntityException(
        'Idempotency-Key must be 16-128 chars (alphanum, dash, underscore)',
      );
    }

    // Replay path: short-circuit if the slot already holds a result.
    const existing = await this.idempotency.get<Order>(
      IDEMPOTENCY_SCOPE,
      userId,
      key,
    );
    if (existing && existing !== 'IN_PROGRESS') {
      res.status(HttpStatus.OK);
      return this.rehydrateDates(existing);
    }
    if (existing === 'IN_PROGRESS') {
      throw new ConflictException('Request still processing — try again');
    }

    // Claim the slot. On race-loss, re-check and replay if a peer finished.
    const claimed = await this.idempotency.setInProgress(
      IDEMPOTENCY_SCOPE,
      userId,
      key,
    );
    if (!claimed) {
      const second = await this.idempotency.get<Order>(
        IDEMPOTENCY_SCOPE,
        userId,
        key,
      );
      if (second && second !== 'IN_PROGRESS') {
        res.status(HttpStatus.OK);
        return this.rehydrateDates(second);
      }
      throw new ConflictException('Request still processing — try again');
    }

    try {
      const order = await this.checkout.placeOrder(
        userId,
        {
          fullName: dto.address.fullName,
          phone: dto.address.phone,
          country: dto.address.country,
          region: dto.address.region ?? null,
          city: dto.address.city,
          postalCode: dto.address.postalCode ?? null,
          street: dto.address.street,
          notes: dto.address.notes ?? null,
        },
        dto.paymentMethod,
      );
      await this.idempotency.setResult(IDEMPOTENCY_SCOPE, userId, key, order);
      res.status(HttpStatus.CREATED);
      return order;
    } catch (err) {
      // Free the slot so the buyer can retry with the same key.
      await this.idempotency.clear(IDEMPOTENCY_SCOPE, userId, key);
      throw err;
    }
  }

  @Get()
  @ApiOkResponse({
    description: "Paginated list of the current buyer's orders.",
  })
  async listMine(
    @Req() req: Request,
    @Query() query: OrderListQueryDto,
  ): Promise<{ data: Order[]; total: number }> {
    const userId = (req.user as { id: number }).id;
    return this.orders.listMine(userId, {
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: Order })
  async getById(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Order> {
    const userId = (req.user as { id: number }).id;
    return this.orders.getById(userId, id);
  }

  /**
   * Replays go through Redis JSON, so Date fields come back as ISO strings.
   * Re-coerce the timestamps so the response shape matches a fresh placement.
   */
  private rehydrateDates(order: Order): Order {
    if (typeof order.placedAt === 'string') {
      order.placedAt = new Date(order.placedAt);
    }
    if (typeof order.createdAt === 'string') {
      order.createdAt = new Date(order.createdAt);
    }
    if (typeof order.updatedAt === 'string') {
      order.updatedAt = new Date(order.updatedAt);
    }
    for (const so of order.subOrders ?? []) {
      if (typeof so.createdAt === 'string')
        so.createdAt = new Date(so.createdAt);
      if (typeof so.updatedAt === 'string')
        so.updatedAt = new Date(so.updatedAt);
      if (typeof so.packedAt === 'string') so.packedAt = new Date(so.packedAt);
      if (typeof so.shippedAt === 'string')
        so.shippedAt = new Date(so.shippedAt);
      if (typeof so.deliveredAt === 'string')
        so.deliveredAt = new Date(so.deliveredAt);
      for (const oi of so.items ?? []) {
        if (typeof oi.createdAt === 'string')
          oi.createdAt = new Date(oi.createdAt);
      }
    }
    return order;
  }
}
