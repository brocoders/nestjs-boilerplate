import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './domain/product';
import { ProductsService } from './products.service';
import { PublicProductListQueryDto } from './dto/product-list-query.dto';
import { RequestContextService } from '../request-context/request-context.service';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsPublicController {
  constructor(
    private readonly service: ProductsService,
    private readonly ctx: RequestContextService,
  ) {}

  @Get()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' },
        },
        total: { type: 'number' },
      },
    },
  })
  list(@Query() query: PublicProductListQueryDto) {
    const region = query.region ?? this.ctx.getCurrent()?.regionCode;
    return this.service.listForPublic({
      region,
      categorySlug: query.categorySlug,
      q: query.q,
      page: query.page,
      limit: query.limit,
    });
  }

  @Get(':vendorSlug/:productSlug')
  @ApiOkResponse({ type: Product })
  getBySlug(
    @Param('vendorSlug') vendorSlug: string,
    @Param('productSlug') productSlug: string,
    @Query('region') regionParam?: string,
  ) {
    const region = regionParam ?? this.ctx.getCurrent()?.regionCode;
    return this.service.getBySlugForPublic(vendorSlug, productSlug, region);
  }
}
