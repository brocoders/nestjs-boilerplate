import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ProductsService } from '../products/products.service';
import { VendorOrderListQueryDto } from './dto/vendor-order-list-query.dto';
import { OrdersService } from './orders.service';

@ApiTags('Vendor · Orders')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'vendor/orders', version: '1' })
export class VendorOrdersController {
  constructor(
    private readonly orders: OrdersService,
    private readonly products: ProductsService,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      "List the calling vendor's incoming SubOrders, newest first. Optional ?status filter.",
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { type: 'object' } },
        total: { type: 'number' },
      },
    },
  })
  async list(@Req() req: Request, @Query() query: VendorOrderListQueryDto) {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.products.getCallingActiveVendor(userId);
    return this.orders.listForVendor(vendor.id, {
      status: query.status,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary:
      "Hydrated detail for one of the calling vendor's SubOrders. 404 if not theirs (no leak).",
  })
  async getOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.products.getCallingActiveVendor(userId);
    return this.orders.getSubOrderForVendor(vendor.id, id);
  }
}
